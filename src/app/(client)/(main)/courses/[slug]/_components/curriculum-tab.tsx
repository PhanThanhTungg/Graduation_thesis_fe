"use client";

import { ChevronDown, ChevronUp, PlayCircle } from "lucide-react";
import { useState } from "react";
import { CourseCurriculumType, SectionType } from "@/schema/lesson.schema";

interface CurriculumTabProps {
  curriculum: CourseCurriculumType;
}

function countLessons(section: SectionType): number {
  const ownLessons = section.lessons.length;
  const childLessons = section.children
    ? section.children.reduce((total, child) => total + countLessons(child), 0)
    : 0;

  return ownLessons + childLessons;
}

export default function CurriculumTab({ curriculum }: CurriculumTabProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    curriculum.sections.map((section) => section.id),
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  const renderSection = (section: SectionType, level = 0) => {
    const isExpanded = expandedSections.includes(section.id);
    const totalLessonsInSection = countLessons(section);

    return (
      <div
        key={section.id}
        className="border border-border rounded-lg overflow-hidden"
      >
        <button
          onClick={() => toggleSection(section.id)}
          className="w-full bg-card hover:bg-muted transition-colors px-5 py-3 flex items-center gap-2"
          style={{ paddingLeft: `${20 + level * 16}px` }}
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
            <span>{totalLessonsInSection} Lessons</span>
          </div>
        </button>

        {isExpanded && (
          <div className="bg-muted/30">
            {section.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="px-5 py-3 flex items-center gap-3 border-t border-border hover:bg-muted/50 transition-colors"
                style={{ paddingLeft: `${20 + (level + 1) * 16}px` }}
              >
                <PlayCircle className="size-4 text-muted-foreground flex-shrink-0" />
                <span className="flex-1 text-sm text-foreground">
                  {lesson.title}
                </span>
                {lesson.isPreview && (
                  <span className="text-xs text-orange">Preview</span>
                )}
                <span className="text-sm text-muted-foreground">
                  {lesson.duration}
                </span>
              </div>
            ))}

            {section.children &&
              section.children.map((child) => (
                <div key={child.id} className="border-t border-border">
                  {renderSection(child, level + 1)}
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card border border-t-0 border-border rounded-bl-[20px] rounded-br-[20px] p-[25px]">
      <p className="text-base text-foreground leading-relaxed mb-2">
        This course includes {curriculum.totalLessons} lessons with a total
        duration of {curriculum.totalDuration}.
      </p>

      <div className="flex flex-col gap-3">
        {curriculum.sections.map((section) => renderSection(section))}
      </div>
    </div>
  );
}
