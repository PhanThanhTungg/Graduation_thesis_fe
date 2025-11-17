"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { PlayCircle, FileText, ClipboardList, BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionType, LessonItemType } from "@/schema/lesson.schema";
import { pingStatusLesson } from "@/service/lesson.service";
import { showToast } from "@/lib/toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

function countSectionLessons(section: SectionType): number {
  const directLessons = section.lessons.length;
  const childLessons = section.children?.reduce((sum, child) => sum + countSectionLessons(child), 0) ?? 0;
  return directLessons + childLessons;
}

function countSectionCompletedLessons(section: SectionType): number {
  const directCompleted = section.lessons.filter((l) => l.isCompleted).length;
  const childCompleted = section.children?.reduce((sum, child) => sum + countSectionCompletedLessons(child), 0) ?? 0;
  return directCompleted + childCompleted;
}

export function LessonSidebar({
  courseSlug,
  sections: initialSections,
  currentLessonId,
  currentLessonSlug,
  totalDuration,
  totalLessons,
}: LessonSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<number[]>(() => {
    const currentSection = findSectionWithLesson(initialSections, currentLessonId, currentLessonSlug);
    if (currentSection) {
      const parentIds = getAllParentSectionIds(initialSections, currentSection.id);
      return [...parentIds, currentSection.id];
    }
    return [];
  });

  const [sections, setSections] = useState<SectionType[]>(initialSections);
  const [loadingLessons, setLoadingLessons] = useState<Set<number>>(new Set());
  const [hoveredCompletedLesson, setHoveredCompletedLesson] = useState<number | null>(null);

  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

  const updateLessonStatus = useCallback((lessonId: number, progress: "not_started" | "in_progress" | "completed") => {
    const updateSection = (section: SectionType): SectionType => {
      const updatedLessons = section.lessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, isCompleted: progress === "completed", progress } : lesson
      );
      const updatedChildren = section.children?.map(updateSection);
      return {
        ...section,
        lessons: updatedLessons,
        children: updatedChildren,
      };
    };
    setSections((prev) => prev.map(updateSection));
  }, []);

  const completedLessons = useMemo(
    () => sections.reduce((total, section) => total + countSectionCompletedLessons(section), 0),
    [sections]
  );

  const progressPercentage = useMemo(
    () => (totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0),
    [completedLessons, totalLessons]
  );

  const getLessonIcon = useCallback((lesson: LessonItemType) => {
    const iconClass = "w-4 h-4 text-muted-foreground";
    const iconMap = {
      video: <PlayCircle className={iconClass} />,
      quiz: <ClipboardList className={iconClass} />,
      assignment: <FileText className={iconClass} />,
      reading: <BookOpen className={iconClass} />,
    };
    
    return iconMap[lesson.type] ?? <PlayCircle className={iconClass} />;
  }, []);

  const handleToggleLessonStatus = useCallback(async (e: React.MouseEvent, lesson: LessonItemType) => {
    e.preventDefault();
    e.stopPropagation();

    if (!lesson.slug) return;

    setLoadingLessons((prev) => new Set(prev).add(lesson.id));

    try {
      const targetProgress: "not_started" | "in_progress" | "completed" = lesson.isCompleted 
        ? "in_progress" 
        : "completed";
      
      const result = await pingStatusLesson(lesson.slug!, targetProgress);
      updateLessonStatus(lesson.id, result.progress);
      showToast("success", result.progress === "completed" ? "Lesson marked as completed" : "Lesson marked as in progress");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Failed to update lesson status");
    } finally {
      setLoadingLessons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(lesson.id);
        return newSet;
      });
    }
  }, [updateLessonStatus]);

  const renderSection = (section: SectionType, level: number = 0) => {
    const sectionTotalLessons = countSectionLessons(section);
    const sectionCompletedLessons = countSectionCompletedLessons(section);
    const hasChildren = Boolean(section.children?.length);
    const hasLessons = section.lessons.length > 0;
    const canExpand = hasChildren || hasLessons;

    if (!canExpand) {
      return (
        <div key={section.id} className="border-b border-border">
          <div
            className="w-full p-4 flex items-start justify-between"
            style={{ paddingLeft: `${1 + level * 0.75}rem` } as React.CSSProperties}
          >
            <div className="flex-1 text-left">
              <h3 className="font-heading font-semibold mb-1">{section.title}</h3>
              <p className="text-sm text-muted-foreground">
                {sectionCompletedLessons}/{sectionTotalLessons} lessons
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <AccordionItem
        key={section.id}
        value={`section-${section.id}`}
        className="border-b border-border"
      >
        {/* Section Header */}
        <AccordionTrigger
          className={cn(
            "w-full px-4 py-4 flex items-start justify-between transition-colors hover:bg-muted hover:no-underline"
          )}
          style={{ paddingLeft: `${1 + level * 0.75}rem` } as React.CSSProperties}
        >
          <div className="flex-1 text-left">
            <h3 className="font-heading font-semibold mb-1">{section.title}</h3>
            <p className="text-sm text-muted-foreground">
              {sectionCompletedLessons}/{sectionTotalLessons} lessons
            </p>
          </div>
        </AccordionTrigger>

        {/* Content when expanded */}
        <AccordionContent className="bg-muted/30 px-0 py-0">
            {hasChildren ? (
              <div>
                {section.children!.map((childSection) => renderSection(childSection, level + 1))}
              </div>
            ) : hasLessons ? (
              <div>
                {section.lessons.map((lesson) => {
                    const isCurrentLesson = lesson.id === currentLessonId || lesson.slug === currentLessonSlug;
                    const isLoading = loadingLessons.has(lesson.id);
                    const canAccess = lesson.progress === "in_progress" || lesson.progress === "completed";
                    const lessonContent = (
                      <>
                        <div className={`flex-shrink-0 mt-0.5 ${isCurrentLesson ? "text-green" : ""}`}>
                          {getLessonIcon(lesson)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4
                            className={cn(
                              "text-sm font-medium mb-1",
                              isCurrentLesson && "text-green font-semibold",
                              !canAccess && "opacity-50"
                            )}
                          >
                            {lesson.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="capitalize">{lesson.type}</span>
                            <span>•</span>
                            <span>{lesson.duration}</span>
                            {lesson.isPreview && (
                              <>
                                <span>•</span>
                                <span className="text-orange">Preview</span>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    );

                    return (
                      <div
                        key={lesson.id}
                        className={cn(
                          "flex items-start gap-3 p-4 border-t border-border transition-colors group",
                          canAccess && "hover:bg-card",
                          isCurrentLesson && "bg-green-foreground border-l-4 border-l-green",
                          !canAccess && "opacity-60 cursor-not-allowed"
                        )}
                        style={{ paddingLeft: `${1.5 + level * 0.75}rem` } as React.CSSProperties}
                      >
                        {canAccess ? (
                          <Link
                            href={`/course/${courseSlug}/learn/${lesson.slug || lesson.id}`}
                            className="flex items-start gap-3 flex-1 min-w-0"
                          >
                            {lessonContent}
                          </Link>
                        ) : (
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {lessonContent}
                          </div>
                        )}

                        {canAccess && (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {lesson.isCompleted ? (
                              <button
                                type="button"
                                onClick={(e) => handleToggleLessonStatus(e, lesson)}
                                onMouseEnter={() => setHoveredCompletedLesson(lesson.id)}
                                onMouseLeave={() => setHoveredCompletedLesson(null)}
                                disabled={isLoading}
                                className={cn(
                                  "px-2 py-1 text-xs font-medium rounded transition-all border-2",
                                  hoveredCompletedLesson === lesson.id
                                    ? "text-destructive border-destructive hover:bg-destructive hover:text-white"
                                    : "text-green border-green hover:bg-green hover:text-white",
                                  isLoading && "cursor-not-allowed opacity-70"
                                )}
                                title="Mark as incomplete"
                              >
                                {isLoading ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : hoveredCompletedLesson === lesson.id ? (
                                  "Undo"
                                ) : (
                                  "Completed"
                                )}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => handleToggleLessonStatus(e, lesson)}
                                disabled={isLoading}
                                className={cn(
                                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                                  "opacity-0 group-hover:opacity-100",
                                  "bg-green text-white hover:bg-green/90",
                                  isLoading && "opacity-100 cursor-not-allowed"
                                )}
                                title="Mark as complete"
                              >
                                {isLoading ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  "Complete"
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            ) : null}
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-6 border-b border-primary">
        <h2 className="font-heading text-xl font-semibold mb-4">Course Content</h2>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Your progress</span>
            <span className="font-medium">
              {completedLessons}/{totalLessons} lessons
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-green transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{Math.round(progressPercentage)}% Complete</span>
            <span>{totalDuration}</span>
          </div>
        </div>
      </div>

      {/* Curriculum List */}
      <div className="flex-1 overflow-y-auto">
        <Accordion
          type="multiple"
          value={expandedSections.map((id) => `section-${id}`)}
          onValueChange={(values) => {
            const sectionIds = values.map((v) => parseInt(v.replace('section-', '')));
            setExpandedSections(sectionIds);
          }}
        >
          {sections.map((section) => renderSection(section, 0))}
        </Accordion>
      </div>
    </div>
  );
}
