"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  VideoPlayer,
  LessonSidebar,
  LessonTabs,
  LessonOverviewTab,
  LessonNotesTab,
  LessonAnnouncementsTab,
  LessonReviewsTab,
  type LessonTabId,
} from "@/components/lesson";
import { CourseType } from "@/schema/course.schema";
import { CourseCurriculumType, LessonItemType } from "@/schema/lesson.schema";
import { cn } from "@/lib/utils";

interface LessonViewProps {
  course: CourseType;
  curriculum: CourseCurriculumType;
  currentLesson: LessonItemType;
}

export function LessonView({ course, curriculum, currentLesson }: LessonViewProps) {
  const [activeTab, setActiveTab] = useState<LessonTabId>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleProgress = (progress: number) => {
    // In real app, save progress to backend
    console.log("Progress:", progress);
  };

  const handleComplete = () => {
    // In real app, mark lesson as complete in backend
    console.log("Lesson completed");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <LessonOverviewTab
            lesson={currentLesson}
            courseDescription={course.courseDescription.detail}
          />
        );
      case "notes":
        return <LessonNotesTab lessonId={currentLesson.id} />;
      case "announcements":
        return <LessonAnnouncementsTab courseId={course.id} />;
      case "reviews":
        return <LessonReviewsTab courseId={course.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[--color-background] flex flex-col">
      {/* Top Navigation */}
      <div className="bg-[--color-card] border-b border-[--color-border] sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/course/${course.slug}`}
              className="flex items-center gap-2 text-[--color-muted-foreground] hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back to Course</span>
            </Link>
            <div className="h-6 w-px bg-[--color-border]" />
            <h1 className="font-heading text-lg font-semibold line-clamp-1">
              {course.title}
            </h1>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video and Content Section */}
        <div className={cn("flex-1 flex flex-col overflow-hidden", isSidebarOpen && "lg:mr-96")}>
          {/* Video Player */}
          <div className="bg-black">
            <div className="max-w-6xl mx-auto">
              {currentLesson.type === "video" && currentLesson.embedUrl ? (
                <VideoPlayer
                  embedUrl={typeof currentLesson.embedUrl === "string" ? currentLesson.embedUrl : ""}
                  title={currentLesson.title}
                  onProgress={handleProgress}
                  onComplete={handleComplete}
                />
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-900">
                  <div className="text-center text-white">
                    <p className="text-xl mb-2">
                      {currentLesson.type === "quiz"
                        ? "Quiz"
                        : currentLesson.type === "assignment"
                        ? "Assignment"
                        : "Reading Material"}
                    </p>
                    <p className="text-[--color-muted-foreground]">
                      {currentLesson.title}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs and Content */}
          <div className="flex-1 overflow-y-auto bg-[--color-background]">
            <div className="max-w-6xl mx-auto">
              <LessonTabs activeTab={activeTab} onTabChange={setActiveTab} />
              <div className="pb-8">{renderTabContent()}</div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={cn(
            "fixed lg:fixed right-0 top-[73px] bottom-0 w-96 bg-[--color-card] border-l border-[--color-border] shadow-lg transform transition-transform duration-300 z-30",
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <LessonSidebar
            courseSlug={course.slug}
            sections={curriculum.sections}
            currentLessonId={currentLesson.id}
            currentLessonSlug={currentLesson.slug}
            totalDuration={curriculum.totalDuration}
            totalLessons={curriculum.totalLessons}
          />
        </div>
      </div>
    </div>
  );
}
