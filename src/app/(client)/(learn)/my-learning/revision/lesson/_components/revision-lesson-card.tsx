"use client";

import { useState } from "react";
import Link from "next/link";
import { LessonReviewSettingType } from "@/schema/review-space.schema";
import {
  toggleLessonInReviewSpace,
  updateLessonReviewSetting,
} from "@/service/review-space.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, Eye } from "lucide-react";
import { showToast } from "@/lib/toast";
import { statusLabels, statusColors } from "@/lib/review-space.constants";
import { formatInterval } from "@/lib/helpers";

interface RevisionLessonCardProps {
  lesson: LessonReviewSettingType;
  onRemove: (lessonId: string) => void;
  onUpdate?: (lesson: LessonReviewSettingType) => void;
}

export default function RevisionLessonCard({
  lesson,
  onRemove,
  onUpdate,
}: RevisionLessonCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleToggleReviewEnabled = async (checked: boolean) => {
    try {
      setIsUpdating(true);
      const updated = await updateLessonReviewSetting(lesson.lessonId, {
        reviewEnabled: checked,
      });
      if (onUpdate) {
        onUpdate(updated);
      }
      showToast("success", "Review enabled updated successfully");
    } catch (error) {
      console.error("Error updating review enabled:", error);
      showToast("error", "Failed to update review enabled");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="mb-[-20px]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <Link
                href={`/my-learning/revision/lesson/${lesson.lessonId}`}
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
          <Switch
            checked={lesson.reviewEnabled}
            onCheckedChange={handleToggleReviewEnabled}
            disabled={isUpdating}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
              {formatInterval(lesson.intervalDays ?? lesson.interval ?? 0)}
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
          <div>
            <p className="text-xs text-muted-foreground mb-1">Actions</p>
            <div className="flex items-center gap-1">
              <Link
                href={`/course/${lesson.courseSlug}/learn/${lesson.lessonSlug}`}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:text-green"
                >
                  <Eye className="size-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={isRemoving}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
