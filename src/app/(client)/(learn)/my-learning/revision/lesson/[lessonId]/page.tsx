"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLessonReviewSetting } from "./_hooks/use-lesson-review-setting";
import { ReviewStatusCard } from "./_components/review-status-card";
import { ReviewMetricsCard } from "./_components/review-metrics-card";
import { NoteCard } from "./_components/note-card";
import { QuestionGenerationCard } from "./_components/question-generation-card";

export default function LessonReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;
  const [isOpen, setIsOpen] = useState(true);

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

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold">{setting.lessonTitle}</h1>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {setting.courseTitle}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="gap-2">
                  {isOpen ? (
                    <>
                      <span className="text-sm">Hide</span>
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span className="text-sm">Show</span>
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-6">
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
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {setting.lessonSlug && (
        <div className="mt-6">
          <QuestionGenerationCard lessonSlug={setting.lessonSlug} />
        </div>
      )}
    </div>
  );
}
