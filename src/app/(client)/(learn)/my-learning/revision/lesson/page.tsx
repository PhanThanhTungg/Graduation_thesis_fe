"use client";

import { useEffect, useMemo, useState } from "react";
import { getReviewSpaceLessons } from "@/service/review-space.service";
import {
  LessonReviewSettingType,
  LessonReviewStatus,
} from "@/schema/review-space.schema";
import RevisionLessonCard from "./_components/revision-lesson-card";
import RevisionFilters from "./_components/revision-filters";
import RevisionPagination from "./_components/revision-pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

export default function RevisionLessonPage() {
  const [lessons, setLessons] = useState<LessonReviewSettingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<
    LessonReviewStatus | "all"
  >("all");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedReviewStep, setSelectedReviewStep] = useState<string>("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch lessons with pagination
  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      const response = await getReviewSpaceLessons({
        page: currentPage,
        limit: itemsPerPage,
      });
      setLessons(response.data);
      setTotalItems(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      console.error("Error fetching review space lessons:", err);
      setError("Failed to load review space lessons");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [currentPage, itemsPerPage]);

  // Get unique courses for filter (from current page data)
  const courses = useMemo(() => {
    const uniqueCourses = new Map<string, string>();
    lessons.forEach((lesson) => {
      if (!uniqueCourses.has(lesson.courseId)) {
        uniqueCourses.set(lesson.courseId, lesson.courseTitle);
      }
    });
    return Array.from(uniqueCourses.entries()).map(([id, title]) => ({
      id,
      title,
    }));
  }, [lessons]);

  // Client-side filter for current page
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      // Filter by status
      if (selectedStatus !== "all" && lesson.status !== selectedStatus) {
        return false;
      }

      // Filter by course
      if (selectedCourse !== "all" && lesson.courseId !== selectedCourse) {
        return false;
      }

      // Filter by review step
      if (selectedReviewStep !== "all") {
        if (selectedReviewStep === "5+") {
          if (lesson.reviewStep < 5) return false;
        } else {
          if (lesson.reviewStep !== parseInt(selectedReviewStep)) return false;
        }
      }

      return true;
    });
  }, [lessons, selectedStatus, selectedCourse, selectedReviewStep]);

  // Reset to page 1 when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleRemoveLesson = (lessonId: string) => {
    setLessons((prev) => prev.filter((lesson) => lesson.lessonId !== lessonId));
    setTotalItems((prev) => prev - 1);
  };

  const handleUpdateLesson = (updatedLesson: LessonReviewSettingType) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.lessonId === updatedLesson.lessonId ? updatedLesson : lesson,
      ),
    );
  };

  const handleClearFilters = () => {
    setSelectedStatus("all");
    setSelectedCourse("all");
    setSelectedReviewStep("all");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">Loading review space...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-2xl font-semibold text-destructive mb-2">{error}</p>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-2xl font-semibold text-muted-foreground mb-2">
          No lessons in review space
        </p>
        <p className="text-muted-foreground">
          Add lessons to your review space to start reviewing
        </p>
      </div>
    );
  }

  return (
    <div className="py-8 container-sm">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="size-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/my-learning/courses">
              My Learning
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/my-learning/revision">
              Revision
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Lessons</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Review Lessons</h1>
        <p className="text-muted-foreground">
          Manage and review your lessons using spaced repetition
        </p>
      </div>

      <RevisionFilters
        courses={courses}
        selectedStatus={selectedStatus}
        selectedCourse={selectedCourse}
        selectedReviewStep={selectedReviewStep}
        onStatusChange={setSelectedStatus}
        onCourseChange={setSelectedCourse}
        onReviewStepChange={setSelectedReviewStep}
        onClearFilters={handleClearFilters}
      />

      {filteredLessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-xl font-semibold text-muted-foreground mb-2">
            No lessons match your filters
          </p>
          <p className="text-muted-foreground">
            Try adjusting your filter criteria
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {filteredLessons.map((lesson) => (
              <RevisionLessonCard
                key={lesson.id}
                lesson={lesson}
                onRemove={handleRemoveLesson}
                onUpdate={handleUpdateLesson}
              />
            ))}
          </div>

          <RevisionPagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </>
      )}
    </div>
  );
}
