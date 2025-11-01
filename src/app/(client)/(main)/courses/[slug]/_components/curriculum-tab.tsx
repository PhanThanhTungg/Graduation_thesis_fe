"use client"

import { ChevronDown, ChevronUp, Clock, PlayCircle } from "lucide-react";
import { useState } from "react";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  type: "video" | "quiz";
  isPreview?: boolean;
  isLocked?: boolean;
}

interface Section {
  id: number;
  title: string;
  lessonCount: number;
  totalDuration: string;
  lessons: Lesson[];
}

const mockSections: Section[] = [
  {
    id: 1,
    title: "Lessons with video content",
    lessonCount: 3,
    totalDuration: "45 Mins",
    lessons: [
      { id: 1, title: "Lessons with video content", duration: "10:30", type: "video", isPreview: true },
      { id: 2, title: "Lessons with video content", duration: "10:05", type: "video", isPreview: true },
      { id: 3, title: "Lessons with video content", duration: "12:45", type: "video", isLocked: true },
    ],
  },
  {
    id: 2,
    title: "Lessons With Video Content",
    lessonCount: 3,
    totalDuration: "45 Mins",
    lessons: [],
  },
  {
    id: 3,
    title: "Lessons With Video Content",
    lessonCount: 3,
    totalDuration: "45 Mins",
    lessons: [],
  },
  {
    id: 4,
    title: "Lessons With Video Content",
    lessonCount: 3,
    totalDuration: "45 Mins",
    lessons: [],
  },
];

export default function CurriculumTab() {
  const [expandedSections, setExpandedSections] = useState<number[]>([1]);

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div className="bg-card border border-t-0 border-border rounded-bl-[20px] rounded-br-[20px] p-[25px]">
      <p className="text-base text-foreground leading-relaxed mb-5">
        LearnPress is a comprehensive WordPress LMS Plugin for WordPress. This is one of the best WordPress
        LMS Plugins which can be used to easily create & sell courses online.
      </p>

      <div className="flex flex-col gap-3">
        {mockSections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);

          return (
            <div key={section.id} className="border border-border rounded-lg overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full bg-card hover:bg-muted transition-colors px-5 py-3 flex items-center gap-2"
              >
                {isExpanded ? (
                  <ChevronUp className="size-4 text-foreground" />
                ) : (
                  <ChevronDown className="size-4 text-foreground" />
                )}
                <h3 className="flex-1 text-left text-sm font-semibold text-foreground capitalize">
                  {section.title}
                </h3>
                <div className="flex items-center gap-5 text-sm text-muted-foreground">
                  <span>{section.lessonCount} Lessons</span>
                  <span>{section.totalDuration}</span>
                </div>
              </button>

              {/* Lessons List */}
              {isExpanded && section.lessons.length > 0 && (
                <div className="bg-muted/30">
                  {section.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="px-5 py-3 flex items-center gap-3 border-t border-border hover:bg-muted/50 transition-colors"
                    >
                      <PlayCircle className="size-4 text-muted-foreground flex-shrink-0" />
                      <span className="flex-1 text-sm text-foreground">
                        {lesson.title}
                      </span>
                      {lesson.isPreview && (
                        <span className="px-2 py-0.5 text-xs text-white bg-blue-500 rounded">
                          Preview
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {lesson.duration}
                      </span>
                      {lesson.isLocked && (
                        <span className="text-muted-foreground">🔒</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
