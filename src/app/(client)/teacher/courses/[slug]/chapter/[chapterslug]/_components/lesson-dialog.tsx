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
import { Checkbox } from "@/components/ui/checkbox"
import { CreateLessonBodySchema } from "@/schema/lesson.schema"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect, useState, useRef } from "react"
import { Loader2, Upload, Eye, X, File as FileIcon } from "lucide-react"
import { post } from "@/lib/request"
import { showToast } from "@/lib/toast"

type LessonData = {
  id: string
  title: string
  description?: string | null
  isFree?: boolean
  videoLesson?: {
    id: string
    videoId: string
    embedUrl: string
  } | null
  files?: {
    id: string
    fileUrl: string
    fileName: string
    fileSize: number
  }[]
}

interface LessonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: z.infer<typeof CreateLessonBodySchema>) => Promise<void>
  mode: "add" | "edit"
  isLoading?: boolean
  lesson?: LessonData | null
}

type FormData = z.infer<typeof CreateLessonBodySchema> & {
  isPreview?: boolean
}

export function LessonDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  mode,
  isLoading = false,
  lesson = null
}: LessonDialogProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedVideo, setUploadedVideo] = useState<{ videoId: string; embedUrl: string } | null>(null)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<{ fileUrl: string; fileName: string; fileSize: number }[]>([])
  const [isUploadingFiles, setIsUploadingFiles] = useState(false)
  const [uploadingFileIndex, setUploadingFileIndex] = useState<number | null>(null)
  const filesInputRef = useRef<HTMLInputElement>(null)
  
  const [draftData, setDraftData] = useState<{
    title?: string
    content?: string
    isPreview?: boolean
    uploadedVideo?: { videoId: string; embedUrl: string } | null
    uploadedFiles?: { fileUrl: string; fileName: string; fileSize: number }[]
  } | null>(null)

  const isSubmittingRef = useRef(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(CreateLessonBodySchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      isPreview: false,
      content: "",
    },
  })


  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video")
      video.preload = "metadata"
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        resolve(Math.round(video.duration))
      }
      video.onerror = () => {
        reject(new Error("Failed to load video metadata"))
      }
      video.src = URL.createObjectURL(file)
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("video/")) {
        showToast("error", "Please select a video file")
        return
      }
      setSelectedFile(file)
      setUploadedVideo(null)
    }
  }

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files])
    }
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) {
      showToast("error", "Please select at least one file")
      return
    }

    try {
      setIsUploadingFiles(true)
      const newUploadedFiles: { fileUrl: string; fileName: string; fileSize: number }[] = []

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        setUploadingFileIndex(i)

        try {
          const formData = new FormData()
          formData.append("file", file)

          const response = await post<{ fileUrl: string; fileName: string; fileSize: number }>(
            "/api/upload/file",
            formData,
            { baseUrl: "/" }
          )

          if (response.status === 200 && "fileUrl" in response.payload) {
            newUploadedFiles.push({
              fileUrl: response.payload.fileUrl,
              fileName: response.payload.fileName,
              fileSize: response.payload.fileSize,
            })
          } else {
            throw new Error("Failed to upload file")
          }
        } catch (error) {
          console.error(`Upload error for file ${file.name}:`, error)
          showToast("error", `Failed to upload ${file.name}`)
        }
      }

      setUploadedFiles((prev) => [...prev, ...newUploadedFiles])
      setSelectedFiles([])
      if (filesInputRef.current) {
        filesInputRef.current.value = ""
      }
      showToast("success", `${newUploadedFiles.length} file(s) uploaded successfully`)
    } catch (error) {
      console.error("Upload error:", error)
      showToast("error", "Failed to upload files")
    } finally {
      setIsUploadingFiles(false)
      setUploadingFileIndex(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast("error", "Please select a video file")
      return
    }

    try {
      setIsUploading(true)

      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("title", selectedFile.name)

      const response = await post<{ videoId: string; embedUrl: string }>(
        "/api/upload/video",
        formData,
        { baseUrl: "/" }
      )

      if (response.status === 200 && "videoId" in response.payload && "embedUrl" in response.payload) {
        const { videoId, embedUrl } = response.payload

        let duration: number | undefined
        try {
          duration = await getVideoDuration(selectedFile)
        } catch (error) {
          console.warn("Failed to get video duration:", error)
          showToast("error", "Failed to get video duration. Please try again.")
          return
        }

        if (!duration || duration <= 0) {
          showToast("error", "Invalid video duration. Please try again.")
          return
        }

        setUploadedVideo({ videoId, embedUrl })
        setValue("videoId", videoId)
        setValue("embedUrl", embedUrl)
        setValue("duration", duration)

        showToast("success", "Video uploaded successfully")
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        throw new Error("Failed to upload video")
      }
    } catch (error) {
      console.error("Upload error:", error)
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to upload video"
      )
    } finally {
      setIsUploading(false)
    }
  }

  useEffect(() => {
    if (open && !isLoading && !isSubmittingRef.current) {
      if (mode === "edit" && lesson) {
        reset({
          title: lesson.title,
          isPreview: lesson.isFree ?? false,
          content: lesson.description || "",
          videoId: lesson.videoLesson?.videoId || "",
          embedUrl: lesson.videoLesson?.embedUrl || "",
        })
        if (lesson.videoLesson) {
          setUploadedVideo({
            videoId: lesson.videoLesson.videoId,
            embedUrl: lesson.videoLesson.embedUrl,
          })
        } else {
          setUploadedVideo(null)
        }
        if (lesson.files && lesson.files.length > 0) {
          setUploadedFiles(lesson.files.map(file => ({
            fileUrl: file.fileUrl,
            fileName: file.fileName,
            fileSize: file.fileSize,
          })))
        } else {
          setUploadedFiles([])
        }
        setSelectedFiles([])
      } else if (mode === "add") {
        if (draftData) {
          reset({
            title: draftData.title || "",
            isPreview: draftData.isPreview || false,
            content: draftData.content || "",
            videoId: draftData.uploadedVideo?.videoId || "",
            embedUrl: draftData.uploadedVideo?.embedUrl || "",
          })
          setUploadedVideo(draftData.uploadedVideo || null)
          setUploadedFiles(draftData.uploadedFiles || [])
        } else {
          reset({
            title: "",
            isPreview: false,
            content: "",
          })
          setUploadedVideo(null)
          setUploadedFiles([])
        }
        setSelectedFile(null)
        setSelectedFiles([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        if (filesInputRef.current) {
          filesInputRef.current.value = ""
        }
      }
    }
  }, [open, reset, mode, lesson, draftData, isLoading])

  const onSubmit = async (data: FormData) => {
    try {
      isSubmittingRef.current = true
      const submitData = {
        ...data,
        files: mode === "edit" ? uploadedFiles : uploadedFiles.length > 0 ? uploadedFiles : undefined,
      }
      await onSave(submitData)
    } catch {
    } finally {
      isSubmittingRef.current = false
    }
  }

  const handleClose = () => {
    if (isLoading) return
    
    if (mode === "add") {
      const currentValues = watch()
      setDraftData({
        title: currentValues.title,
        content: currentValues.content,
        isPreview: currentValues.isPreview,
        uploadedVideo: uploadedVideo,
        uploadedFiles: uploadedFiles,
      })
    }
    
    reset()
    setUploadedVideo(null)
    setSelectedFile(null)
    setSelectedFiles([])
    setUploadedFiles([])
    isSubmittingRef.current = false
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (filesInputRef.current) {
      filesInputRef.current.value = ""
    }
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
              <Label htmlFor="video-upload">Video (Optional)</Label>
              {uploadedVideo && (
                <div className="mb-1 p-4 border rounded-lg bg-accent/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Video uploaded</p>
                      <p className="text-xs text-muted-foreground">
                        Video ID: {uploadedVideo.videoId}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPreviewModalOpen(true)}
                      className="ml-4"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Video
                    </Button>
                  </div>
                </div>
              )}
              <Input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={isUploading}
                className=""
              />
              {selectedFile && !uploadedVideo && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                  <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="bg-green hover:bg-green/90"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Video
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="files-upload">Files (Optional)</Label>
              {uploadedFiles.length > 0 && (
                <div className="mb-2 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-accent/50 flex items-center justify-between">
                      <div className="flex-1 flex items-center gap-2">
                        <FileIcon className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.fileSize / 1024).toFixed(2)} KB
                          </p>
                          <a
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-green hover:underline break-all"
                          >
                            {file.fileUrl}
                          </a>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUploadedFile(index)}
                        className="ml-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Input
                id="files-upload"
                type="file"
                multiple
                onChange={handleFilesChange}
                ref={filesInputRef}
                disabled={isUploadingFiles}
                className=""
              />
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="space-y-1">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                        <span className="text-xs text-muted-foreground truncate flex-1">
                          {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                        {uploadingFileIndex === index ? (
                          <Loader2 className="w-4 h-4 animate-spin ml-2" />
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSelectedFile(index)}
                            className="ml-2 h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    onClick={handleUploadFiles}
                    disabled={isUploadingFiles}
                    className="bg-green hover:bg-green/90"
                  >
                    {isUploadingFiles ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload {selectedFiles.length} File(s)
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

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

      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Video Preview</DialogTitle>
          </DialogHeader>
          {uploadedVideo?.embedUrl && (
            <div className="aspect-video rounded-lg overflow-hidden border bg-black">
              <iframe
                src={uploadedVideo.embedUrl}
                className="w-full h-full"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}

