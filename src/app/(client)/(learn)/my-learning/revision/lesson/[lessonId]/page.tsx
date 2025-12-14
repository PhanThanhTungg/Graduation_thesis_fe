"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLessonReviewSetting } from "./_hooks/use-lesson-review-setting";
import { ReviewStatusCard } from "./_components/review-status-card";
import { ReviewMetricsCard } from "./_components/review-metrics-card";
import { NoteCard } from "./_components/note-card";

export default function LessonReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;

  const {
    setting,
    isLoading,
    error,
    isUpdating,
    noteValue,
    setNoteValue,
    handleToggleReviewEnabled,
    handleNoteBlur,
  } = useLessonReviewSetting(lessonId);

  if (isLoading) {
    return (
      <div className="py-8 container-sm">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground">Loading lesson details...</p>
        </div>
      </div>
    );
  }

  if (error || !setting) {
    return (
      <div className="py-8 container-sm">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-2xl font-semibold text-destructive mb-2">
            {error || "Lesson review setting not found"}
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="size-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 container-sm">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="size-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/my-learning/courses">
              My Learning
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/my-learning/revision">
              Revision
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/my-learning/revision/lesson">
              Lessons
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h1 className="text-xl font-bold">{setting.lessonTitle}</h1>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{setting.courseTitle}</span>
        </div>
      </div>

      <div className="space-y-6">
        <ReviewStatusCard
          setting={setting}
          isUpdating={isUpdating}
          onToggleReviewEnabled={handleToggleReviewEnabled}
        />
        <ReviewMetricsCard setting={setting} />
        <NoteCard
          noteValue={noteValue}
          isUpdating={isUpdating}
          onNoteChange={setNoteValue}
          onNoteBlur={handleNoteBlur}
        />
      </div>
    </div>
  );
}
