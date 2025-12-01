"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { LessonDialog } from "../../../_components/lesson-dialog";
import { updateLesson } from "@/service/lesson.service";
import { CreateLessonBodySchema } from "@/schema/lesson.schema";
import { z } from "zod";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

type LessonData = {
  id: string;
  title: string;
  description?: string | null;
  isFree?: boolean | undefined;
  isGenQues?: boolean;
  isGenQuiz?: boolean;
  videoLesson?: {
    id: string;
    videoId: string;
    embedUrl: string;
  } | null;
  files?: {
    id: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
  }[];
};

interface EditLessonButtonProps {
  lesson: LessonData;
}

type FormData = z.infer<typeof CreateLessonBodySchema>;

export function EditLessonButton({ lesson }: EditLessonButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleUpdateLesson = async (data: FormData) => {
    try {
      setIsUpdating(true);
      await updateLesson(lesson.id, data);
      showToast("success", "Lesson updated successfully");
      setDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update lesson:", error);
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to update lesson",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
        <Pencil className="w-4 h-4 mr-2" />
        Edit
      </Button>

      <LessonDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
        }}
        onSave={handleUpdateLesson}
        mode="edit"
        isLoading={isUpdating}
        lesson={{
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          isFree: lesson.isFree,
          isGenQues: lesson.isGenQues,
          isGenQuiz: lesson.isGenQuiz,
          videoLesson: lesson.videoLesson || null,
          files: lesson.files || [],
        }}
      />
    </>
  );
}
