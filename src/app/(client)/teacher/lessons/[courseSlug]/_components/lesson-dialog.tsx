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
import { 
  LessonItemType, 
  CreateLessonBodySchema 
} from "@/schema/lesson.schema"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect, useState } from "react"
import { Upload, X, Video } from "lucide-react"

interface LessonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lesson?: LessonItemType
  onSave: (lesson: Omit<LessonItemType, "id" | "isCompleted" | "duration"> & { id?: number, duration?: string, videoUrl?: string | File }) => void
  mode: "add" | "edit"
}

type FormData = z.infer<typeof CreateLessonBodySchema>

export function LessonDialog({ 
  open, 
  onOpenChange, 
  lesson, 
  onSave, 
  mode 
}: LessonDialogProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string>("")

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
      if (lesson && mode === "edit") {
        reset({
          title: lesson.title,
          type: lesson.type,
          isPreview: lesson.isPreview,
          content: lesson.content || "",
        })
        if (lesson.videoUrl && typeof lesson.videoUrl === "string") {
          setVideoPreview(lesson.videoUrl)
        }
      } else {
        reset({
          title: "",
          type: "video",
          isPreview: false,
          content: "",
        })
        setVideoFile(null)
        setVideoPreview("")
      }
    }
  }, [lesson, mode, open, reset])

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith("video/")) {
        setVideoFile(file)
        setVideoPreview(URL.createObjectURL(file))
      } else {
        alert("Please select a valid video file")
      }
    }
  }

  const removeVideo = () => {
    setVideoFile(null)
    setVideoPreview("")
    const input = document.getElementById("video-upload") as HTMLInputElement
    if (input) input.value = ""
  }

  const onSubmit = (data: FormData) => {
    const lessonData: any = {
      id: lesson?.id,
      title: data.title,
      type: data.type,
      isPreview: data.isPreview,
      content: data.content,
    }

    if (data.type === "video") {
      if (videoFile) {
        lessonData.videoUrl = videoFile
      } else if (videoPreview) {
        lessonData.videoUrl = videoPreview
      }
    }

    onSave(lessonData)
    reset()
    setVideoFile(null)
    setVideoPreview("")
    onOpenChange(false)
  }

  const handleClose = () => {
    reset()
    setVideoFile(null)
    setVideoPreview("")
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
              ? "Create a new lesson for this section" 
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
                placeholder="e.g., Welcome to the Course"
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
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
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
                <Label htmlFor="video-upload">
                  Video File
                </Label>
                {!videoPreview ? (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-green transition-colors">
                    <input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="video-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Click to upload video</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          MP4, WebM, or OGG (max 100MB)
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded">
                        <Video className="w-6 h-6 text-green" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {videoFile?.name || "Video uploaded"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {videoFile 
                            ? `${(videoFile.size / (1024 * 1024)).toFixed(2)} MB`
                            : "Previously uploaded"}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeVideo}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="lesson-content">Description</Label>
              <Textarea
                id="lesson-content"
                placeholder="Enter lesson description or content..."
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
                Allow preview for non-enrolled students
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="bg-green hover:bg-green/90"
            >
              {mode === "add" ? "Add Lesson" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
