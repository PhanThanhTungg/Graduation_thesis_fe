"use client";

import { useState, useEffect } from "react";
import { getMyLearning } from "@/service/course.service";
import { ExtendedCourseType } from "@/schema/course.schema";
import HorizontalCourseCard from "./horizontal-course-card";
import MyLearningSearch from "./my-learning-search";
import MyLearningPagination from "./my-learning-pagination";

interface MyLearningClientProps {
  initialCourses: ExtendedCourseType[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function MyLearningClient({
  initialCourses,
  initialPagination,
}: MyLearningClientProps) {
  const [courses, setCourses] = useState<ExtendedCourseType[]>(initialCourses);
  const [pagination, setPagination] = useState(initialPagination);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(initialPagination.page);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const result = await getMyLearning({
          page: currentPage,
          limit: 12,
          ...(debouncedSearch.trim() && { keySearch: debouncedSearch.trim() }),
        });
        setCourses(result.courses);
        if (result.pagination) {
          setPagination(result.pagination);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
        setPagination({
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [debouncedSearch, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <MyLearningSearch onSearchChange={setSearchQuery} />
        {courses.length > 0 && !isLoading && (
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            Showing {courses.length} of {pagination.total} courses
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      ) : courses.length > 0 ? (
        <>
          <div className="flex flex-col gap-4 mb-8">
            {courses.map((course) => (
              <HorizontalCourseCard key={course.id} course={course} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <MyLearningPagination
              totalPages={pagination.totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-2xl font-semibold text-muted-foreground mb-2">
            {debouncedSearch ? "No courses found" : "No courses yet"}
          </p>
          <p className="text-muted-foreground">
            {debouncedSearch
              ? "Try adjusting your search terms"
              : "Start learning by purchasing a course from our catalog"}
          </p>
        </div>
      )}
    </>
  );
}
