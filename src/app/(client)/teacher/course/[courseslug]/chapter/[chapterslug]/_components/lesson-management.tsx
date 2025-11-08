"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { LessonDialog } from "./lesson-dialog"
import { createLesson, getLessonsByChapterId } from "@/service/lesson.service"
import { CreateLessonBodySchema } from "@/schema/lesson.schema"
import { z } from "zod"
import { showToast } from "@/lib/toast"

type LessonType = {
  id: string
  title: string
  description?: string | null
  type: string
  position: number
  duration?: number | null
  slug: string
  chapterId: string
}

interface LessonManagementProps {
  chapterId: string
}

type FormData = z.infer<typeof CreateLessonBodySchema>

export function LessonManagement({ chapterId }: LessonManagementProps) {
  const [lessons, setLessons] = useState<LessonType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadLessons()
  }, [chapterId])

  const loadLessons = async () => {
    try {
      setIsLoading(true)
      const data = await getLessonsByChapterId(chapterId)
      setLessons(data)
    } catch (error) {
      console.error("Failed to load lessons:", error)
      showToast("error", "Failed to load lessons")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateLesson = async (data: FormData) => {
    try {
      setIsCreating(true)
      const newLesson = await createLesson(chapterId, data)
      
      const lessonToAdd: LessonType = {
        id: newLesson.id,
        title: newLesson.title,
        description: newLesson.description,
        type: newLesson.type,
        position: newLesson.position,
        duration: newLesson.duration,
        slug: newLesson.slug,
        chapterId: newLesson.chapterId,
      }
      
      setLessons((prev) => [...prev, lessonToAdd])
      showToast("success", "Lesson created successfully")
      setDialogOpen(false)
    } catch (error) {
      console.error("Failed to create lesson:", error)
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to create lesson"
      )
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Lessons</h2>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-green hover:bg-green/90"
        >
          <Plus className="w-4 h-4" />
          Add Lesson
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading lessons...
        </div>
      ) : lessons.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border rounded-lg">
          No lessons yet. Create your first lesson to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{lesson.title}</h3>
                  {lesson.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {lesson.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-muted-foreground">
                      Type: {lesson.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Position: {lesson.position}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <LessonDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleCreateLesson}
        mode="add"
        isLoading={isCreating}
      />
    </div>
  )
}

