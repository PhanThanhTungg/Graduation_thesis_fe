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
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLessonReviewSetting } from "./_hooks/use-lesson-review-setting";
import { InformationCard } from "./_components/information-card";
import { SettingCard } from "./_components/setting-card";
import { SPRQuestionHistoryCard } from "./_components/spr-question-history-card";

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
    difficultyValue,
    setDifficultyValue,
    typeQuesValue,
    setTypeQuesValue,
    handleToggleReviewEnabled,
    handleSaveSettings,
    hasChanges,
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
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Review Enabled
                    </span>
                    <Switch
                      checked={setting.reviewEnabled}
                      onCheckedChange={handleToggleReviewEnabled}
                      disabled={isUpdating}
                      onClick={(e) => e.stopPropagation()}
                    />
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
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-6">
              <InformationCard setting={setting} />
              <SettingCard
                noteValue={noteValue}
                difficulty={difficultyValue}
                typeQues={typeQuesValue}
                isUpdating={isUpdating}
                hasChanges={hasChanges}
                onNoteChange={setNoteValue}
                onDifficultyChange={setDifficultyValue}
                onTypeQuesChange={setTypeQuesValue}
                onSave={handleSaveSettings}
              />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {setting?.lessonSlug && (
        <div className="mt-6">
          <SPRQuestionHistoryCard lessonSlug={setting.lessonSlug} />
        </div>
      )}
    </div>
  );
}
