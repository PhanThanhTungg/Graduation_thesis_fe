"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Lock, PlayCircle, FileText, ClipboardList, BookOpen, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionType, LessonItemType } from "@/schema/lesson.schema";

interface LessonSidebarProps {
  courseSlug: string;
  sections: SectionType[];
  currentLessonId: number;
  totalDuration: string;
  totalLessons: number;
}

export function LessonSidebar({
  courseSlug,
  sections,
  currentLessonId,
  totalDuration,
  totalLessons,
}: LessonSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<number[]>(() => {
    // Find the section containing the current lesson and expand it by default
    const currentSection = sections.find((section) =>
      section.lessons.some((lesson) => lesson.id === currentLessonId)
    );
    return currentSection ? [currentSection.id] : [sections[0]?.id];
  });

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getLessonIcon = (lesson: LessonItemType) => {
    if (lesson.isCompleted) {
      return <CheckCircle className="w-4 h-4 text-[--color-green]" />;
    }
    
    switch (lesson.type) {
      case "video":
        return <PlayCircle className="w-4 h-4 text-[--color-muted-foreground]" />;
      case "quiz":
        return <ClipboardList className="w-4 h-4 text-[--color-muted-foreground]" />;
      case "assignment":
        return <FileText className="w-4 h-4 text-[--color-muted-foreground]" />;
      case "reading":
        return <BookOpen className="w-4 h-4 text-[--color-muted-foreground]" />;
      default:
        return <PlayCircle className="w-4 h-4 text-[--color-muted-foreground]" />;
    }
  };

  const completedLessons = sections.reduce(
    (total, section) => total + section.lessons.filter((l) => l.isCompleted).length,
    0
  );

  const progressPercentage = (completedLessons / totalLessons) * 100;

  return (
    <div className="h-full flex flex-col bg-white border-l">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="font-heading text-xl font-semibold mb-4">Course Content</h2>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[--color-muted-foreground]">Your progress</span>
            <span className="font-medium">
              {completedLessons}/{totalLessons} lessons
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[--color-green] transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-[--color-muted-foreground]">
            <span>{Math.round(progressPercentage)}% Complete</span>
            <span>{totalDuration}</span>
          </div>
        </div>
      </div>

      {/* Curriculum List */}
      <div className="flex-1 overflow-y-auto">
        {sections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          const sectionCompletedLessons = section.lessons.filter((l) => l.isCompleted).length;
          const sectionTotalLessons = section.lessons.length;

          return (
            <div key={section.id} className="border-b">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 flex items-start justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 text-left">
                  <h3 className="font-heading font-semibold mb-1">{section.title}</h3>
                  <p className="text-sm text-[--color-muted-foreground]">
                    {sectionCompletedLessons}/{sectionTotalLessons} lessons
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-[--color-muted-foreground] flex-shrink-0 mt-0.5" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[--color-muted-foreground] flex-shrink-0 mt-0.5" />
                )}
              </button>

              {/* Lessons List */}
              {isExpanded && (
                <div className="bg-gray-50">
                  {section.lessons.map((lesson, index) => {
                    const isCurrentLesson = lesson.id === currentLessonId;
                    const isLocked = !lesson.isPreview && index > 0 && !section.lessons[index - 1].isCompleted;

                    return (
                      <Link
                        key={lesson.id}
                        href={isLocked ? "#" : `/courses/${courseSlug}/learn/${lesson.id}`}
                        className={cn(
                          "flex items-start gap-3 p-4 border-t hover:bg-white transition-colors",
                          isCurrentLesson && "bg-[--color-orange]/5 border-l-4 border-l-[--color-orange]",
                          isLocked && "cursor-not-allowed opacity-60"
                        )}
                        onClick={(e) => isLocked && e.preventDefault()}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {isLocked ? (
                            <Lock className="w-4 h-4 text-[--color-muted-foreground]" />
                          ) : (
                            getLessonIcon(lesson)
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4
                            className={cn(
                              "text-sm font-medium mb-1",
                              isCurrentLesson && "text-[--color-orange]",
                              lesson.isCompleted && "text-[--color-green]"
                            )}
                          >
                            {lesson.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-[--color-muted-foreground]">
                            <span className="capitalize">{lesson.type}</span>
                            <span>•</span>
                            <span>{lesson.duration}</span>
                            {lesson.isPreview && (
                              <>
                                <span>•</span>
                                <span className="text-[--color-orange]">Preview</span>
                              </>
                            )}
                          </div>
                        </div>

                        {lesson.isCompleted && (
                          <CheckCircle className="w-5 h-5 text-[--color-green] flex-shrink-0" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
