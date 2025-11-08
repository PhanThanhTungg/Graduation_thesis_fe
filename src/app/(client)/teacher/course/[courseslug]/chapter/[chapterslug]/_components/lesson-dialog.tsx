"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CreateLessonBodySchema } from "@/schema/lesson.schema"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

type LessonData = {
  id: string
  title: string
  description?: string | null
  type: string
  videoLesson?: {
    id: string
    videoUrl: string
  } | null
}

interface LessonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: z.infer<typeof CreateLessonBodySchema>) => Promise<void>
  mode: "add" | "edit"
  isLoading?: boolean
  lesson?: LessonData | null
}

type FormData = z.infer<typeof CreateLessonBodySchema>

export function LessonDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  mode,
  isLoading = false,
  lesson = null
}: LessonDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(CreateLessonBodySchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      type: "video",
      isPreview: false,
      content: "",
    },
  })

  const lessonType = watch("type")

  useEffect(() => {
    if (open) {
      if (mode === "edit" && lesson) {
        reset({
          title: lesson.title,
          type: lesson.type as "video" | "theory" | "exercise",
          isPreview: false,
          content: lesson.description || "",
          videoUrl: lesson.videoLesson?.videoUrl || "",
        })
      } else {
        reset({
          title: "",
          type: "video",
          isPreview: false,
          content: "",
        })
      }
    }
  }, [open, reset, mode, lesson])

  const onSubmit = async (data: FormData) => {
    try {
      await onSave(data)
      reset()
    } catch (error) {
    }
  }

  const handleClose = () => {
    if (isLoading) return
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Lesson" : "Edit Lesson"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Create a new lesson for this chapter" 
              : "Update the lesson details"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="lesson-title">
                Lesson Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lesson-title"
                placeholder="e.g., Introduction to JavaScript"
                {...register("title")}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lesson-type">
                Type <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="lesson-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="theory">Theory</SelectItem>
                      <SelectItem value="exercise">Exercise</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type.message}</p>
              )}
            </div>

            {lessonType === "video" && (
              <div className="grid gap-2">
                <Label htmlFor="video-url">Video URL (Optional)</Label>
                <Input
                  id="video-url"
                  placeholder="https://example.com/video.mp4"
                  {...register("videoUrl")}
                />
                <p className="text-xs text-muted-foreground">
                  You can add video URL later
                </p>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="lesson-content">Description (Optional)</Label>
              <Textarea
                id="lesson-content"
                placeholder="You can add description later..."
                {...register("content")}
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="isPreview"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="is-preview"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label
                htmlFor="is-preview"
                className="text-sm font-normal cursor-pointer"
              >
                Allow preview for non-enrolled students (Optional)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isLoading}
              className="bg-green hover:bg-green/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === "add" ? "Adding..." : "Saving..."}
                </>
              ) : (
                mode === "add" ? "Add Lesson" : "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

