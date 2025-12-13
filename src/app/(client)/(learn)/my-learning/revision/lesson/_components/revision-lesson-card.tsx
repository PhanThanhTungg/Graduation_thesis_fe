"use client";

import { useState } from "react";
import Link from "next/link";
import { LessonReviewSettingType } from "@/schema/review-space.schema";
import { toggleLessonInReviewSpace } from "@/service/review-space.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { showToast } from "@/lib/toast";

interface RevisionLessonCardProps {
  lesson: LessonReviewSettingType;
  onRemove: (lessonId: string) => void;
}

const statusLabels: Record<string, string> = {
  new: "New",
  learning: "Learning",
  reviewing: "Reviewing",
  lapsed: "Lapsed",
  suspending: "Suspended",
};

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  learning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  reviewing: "bg-green-500/10 text-green-500 border-green-500/20",
  lapsed: "bg-red-500/10 text-red-500 border-red-500/20",
  suspending: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export default function RevisionLessonCard({
  lesson,
  onRemove,
}: RevisionLessonCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      await toggleLessonInReviewSpace(lesson.lessonId);
      onRemove(lesson.lessonId);
      showToast("success", "Lesson removed from review space");
    } catch (error) {
      console.error("Error removing lesson:", error);
      showToast("error", "Failed to remove lesson from review space");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <Link
                href={`/courses/${lesson.courseId}/learn/${lesson.lessonId}`}
                className="text-lg font-semibold hover:text-green transition-colors"
              >
                {lesson.lessonTitle}
              </Link>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {lesson.courseTitle}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            <Badge
              variant="outline"
              className={statusColors[lesson.status] || ""}
            >
              {statusLabels[lesson.status] || lesson.status}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Review Step</p>
            <p className="text-sm font-medium">{lesson.reviewStep}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Interval</p>
            <p className="text-sm font-medium">
              {lesson.intervalDays} {lesson.intervalDays === 1 ? "day" : "days"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Easiness Factor
            </p>
            <p className="text-sm font-medium">
              {lesson.easinessFactor.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
