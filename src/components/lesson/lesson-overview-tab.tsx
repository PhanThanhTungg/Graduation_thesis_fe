"use client";

import React from "react";
import { LessonItemType } from "@/schema/lesson.schema";

interface LessonOverviewTabProps {
  lesson: LessonItemType;
  courseDescription?: string;
}

export function LessonOverviewTab({ lesson, courseDescription }: LessonOverviewTabProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold mb-4">About This Lesson</h2>
        <div className="prose max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            {lesson.content || "No description available for this lesson."}
          </p>
        </div>
      </div>

      {courseDescription && (
        <div className="pt-6 border-t border-border">
          <h3 className="font-heading text-xl font-semibold mb-3">Course Overview</h3>
          <div className="prose max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {courseDescription}
            </p>
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-border">
        <h3 className="font-heading text-xl font-semibold mb-3">Lesson Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Type</p>
            <p className="font-medium capitalize">{lesson.type}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Duration</p>
            <p className="font-medium">{lesson.duration}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <p className="font-medium">
              {lesson.isCompleted ? (
                <span className="text-green">Completed</span>
              ) : (
                <span className="text-orange">In Progress</span>
              )}
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Access</p>
            <p className="font-medium">
              {lesson.isPreview ? (
                <span className="text-green">Preview Available</span>
              ) : (
                <span>Full Access</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
