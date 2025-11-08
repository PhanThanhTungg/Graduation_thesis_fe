"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Loader2 } from "lucide-react"
import { updateLesson } from "@/service/lesson.service"
import { showToast } from "@/lib/toast"
import { post } from "@/lib/request"

interface UploadVideoProps {
  lessonId: string
  currentVideoId?: string | null
  currentEmbedUrl?: string | null
  onUploadSuccess?: () => void
}

export function UploadVideo({
  lessonId,
  currentVideoId,
  currentEmbedUrl,
  onUploadSuccess,
}: UploadVideoProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("video/")) {
        showToast("error", "Please select a video file")
        return
      }
      setSelectedFile(file)
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

        await updateLesson(lessonId, {
          videoId,
          embedUrl,
        })

        showToast("success", "Video uploaded and saved successfully")
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        onUploadSuccess?.()
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

  return (
    <div className="space-y-4 pt-4 border-t">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Video</h3>
        {currentEmbedUrl && (
          <div className="mb-4">
            <div className="aspect-video rounded-lg overflow-hidden border bg-black">
              <iframe
                src={currentEmbedUrl}
                className="w-full h-full"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Video ID: {currentVideoId}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="video-upload">Upload Video</Label>
            <Input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={isUploading}
              className="mt-2"
            />
            {selectedFile && (
              <p className="text-xs text-muted-foreground mt-1">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
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
      </div>
    </div>
  )
}

