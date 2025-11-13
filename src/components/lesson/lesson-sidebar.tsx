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
  currentLessonSlug?: string;
  totalDuration: string;
  totalLessons: number;
}

function findSectionWithLesson(
  sections: SectionType[],
  lessonId: number,
  lessonSlug?: string
): SectionType | null {
  for (const section of sections) {
    if (section.lessons.some((l) => l.id === lessonId || l.slug === lessonSlug)) {
      return section;
    }
    if (section.children) {
      const found = findSectionWithLesson(section.children, lessonId, lessonSlug);
      if (found) return found;
    }
  }
  return null;
}

function getAllParentSectionIds(
  sections: SectionType[],
  targetSectionId: number,
  parentIds: number[] = []
): number[] {
  for (const section of sections) {
    if (section.id === targetSectionId) {
      return parentIds;
    }
    if (section.children) {
      const childFound = section.children.some((child) => child.id === targetSectionId);
      if (childFound) {
        return [...parentIds, section.id];
      }
      const found = getAllParentSectionIds(section.children, targetSectionId, [...parentIds, section.id]);
      if (found.length > 0) {
        return found;
      }
    }
  }
  return [];
}

function getAllSectionIds(sections: SectionType[]): number[] {
  const ids: number[] = [];
  for (const section of sections) {
    ids.push(section.id);
    if (section.children) {
      ids.push(...getAllSectionIds(section.children));
    }
  }
  return ids;
}

function countSectionLessons(section: SectionType): number {
  let count = section.lessons.length;
  if (section.children) {
    count += section.children.reduce((sum, child) => sum + countSectionLessons(child), 0);
  }
  return count;
}

function countSectionCompletedLessons(section: SectionType): number {
  let count = section.lessons.filter((l) => l.isCompleted).length;
  if (section.children) {
    count += section.children.reduce((sum, child) => sum + countSectionCompletedLessons(child), 0);
  }
  return count;
}

export function LessonSidebar({
  courseSlug,
  sections,
  currentLessonId,
  currentLessonSlug,
  totalDuration,
  totalLessons,
}: LessonSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<number[]>(() => {
    const currentSection = findSectionWithLesson(sections, currentLessonId, currentLessonSlug);
    if (currentSection) {
      const parentIds = getAllParentSectionIds(sections, currentSection.id);
      return [...parentIds, currentSection.id];
    }
    return [];
  });

  const toggleSection = (sectionId: number, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    setExpandedSections((prev) => {
      const isCurrentlyExpanded = prev.includes(sectionId);
      if (isCurrentlyExpanded) {
        return prev.filter((id) => id !== sectionId);
      } else {
        return [...prev, sectionId];
      }
    });
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
    (total, section) => total + countSectionCompletedLessons(section),
    0
  );

  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const renderSection = (section: SectionType, level: number = 0) => {
    const isExpanded = expandedSections.includes(section.id);
    const sectionTotalLessons = countSectionLessons(section);
    const sectionCompletedLessons = countSectionCompletedLessons(section);
    const hasChildren = section.children && section.children.length > 0;
    const hasLessons = section.lessons.length > 0;
    const canExpand = hasChildren || hasLessons;

    return (
      <div key={section.id} className="border-b border-[--color-border]">
        {/* Section Header */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (canExpand) {
              toggleSection(section.id, e);
            }
          }}
          className={cn(
            "w-full p-4 flex items-start justify-between transition-colors",
            canExpand && "hover:bg-[--color-muted] cursor-pointer",
            !canExpand && "cursor-default"
          )}
          style={{ paddingLeft: `${1 + level * 0.75}rem` }}
        >
          <div className="flex-1 text-left">
            <h3 className="font-heading font-semibold mb-1">{section.title}</h3>
            <p className="text-sm text-[--color-muted-foreground]">
              {sectionCompletedLessons}/{sectionTotalLessons} lessons
            </p>
          </div>
          {canExpand && (
            <>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-[--color-muted-foreground] flex-shrink-0 mt-0.5" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[--color-muted-foreground] flex-shrink-0 mt-0.5" />
              )}
            </>
          )}
        </button>

        {/* Content when expanded */}
        {isExpanded && (
          <div className="bg-[--color-muted]/30">
            {hasChildren ? (
              section.children && (
                <div>
                  {section.children.map((childSection) => renderSection(childSection, level + 1))}
                </div>
              )
            ) : (
              hasLessons && (
                <div>
                  {section.lessons.map((lesson, index) => {
                    const isCurrentLesson = lesson.id === currentLessonId || lesson.slug === currentLessonSlug;
                    const prevLesson = index > 0 ? section.lessons[index - 1] : null;
                    const isLocked = !lesson.isPreview && prevLesson && !prevLesson.isCompleted;

                    return (
                      <Link
                        key={lesson.id}
                        href={isLocked ? "#" : `/course/${courseSlug}/learn/${lesson.slug || lesson.id}`}
                        className={cn(
                          "flex items-start gap-3 p-4 border-t border-[--color-border] hover:bg-[--color-card] transition-colors",
                          isCurrentLesson && "bg-[--color-orange]/10 dark:bg-[--color-orange]/20 border-l-4 border-l-[--color-orange]",
                          isLocked && "cursor-not-allowed opacity-60"
                        )}
                        style={{ paddingLeft: `${1.5 + level * 0.75}rem` }}
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
              )
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[--color-card]">
      {/* Header */}
      <div className="p-6 border-b border-[--color-border]">
        <h2 className="font-heading text-xl font-semibold mb-4">Course Content</h2>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[--color-muted-foreground]">Your progress</span>
            <span className="font-medium">
              {completedLessons}/{totalLessons} lessons
            </span>
          </div>
          <div className="w-full h-2 bg-[--color-muted] rounded-full overflow-hidden">
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
        {sections.map((section) => renderSection(section, 0))}
      </div>
    </div>
  );
}
