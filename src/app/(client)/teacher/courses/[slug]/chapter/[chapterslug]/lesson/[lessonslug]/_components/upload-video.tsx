"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Loader2, Eye } from "lucide-react";
import { updateLesson } from "@/service/lesson.service";
import { showToast } from "@/lib/toast";
import { post } from "@/lib/request";

interface UploadVideoProps {
  lessonId: string;
  currentVideoId?: string | null;
  currentEmbedUrl?: string | null;
  onUploadSuccess?: () => void;
}

export function UploadVideo({
  lessonId,
  currentVideoId,
  currentEmbedUrl,
  onUploadSuccess,
}: UploadVideoProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration));
      };
      video.onerror = () => {
        reject(new Error("Failed to load video metadata"));
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        showToast("error", "Please select a video file");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast("error", "Please select a video file");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", selectedFile.name);

      const response = await post<{ videoId: string; embedUrl: string }>(
        "/api/upload/video",
        formData,
        { baseUrl: "/" },
      );

      if (
        response.status === 200 &&
        "videoId" in response.payload &&
        "embedUrl" in response.payload
      ) {
        const { videoId, embedUrl } = response.payload;

        let duration: number | undefined;
        try {
          duration = await getVideoDuration(selectedFile);
        } catch (error) {
          console.warn("Failed to get video duration:", error);
        }

        await updateLesson(lessonId, {
          title: "",
          videoId,
          embedUrl,
          duration,
          videoSize: selectedFile.size,
        } as Parameters<typeof updateLesson>[1]);

        showToast("success", "Video uploaded and saved successfully");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        onUploadSuccess?.();
      } else {
        throw new Error("Failed to upload video");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to upload video",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">
          Video
        </h3>
        {currentEmbedUrl && (
          <div className="mb-4 p-4 border rounded-lg bg-accent/50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Video uploaded</p>
                <p className="text-xs text-muted-foreground">
                  Video ID: {currentVideoId}
                </p>
                <p className="text-xs text-muted-foreground break-all">
                  {currentEmbedUrl}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVideoModalOpen(true)}
                className="ml-4"
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="video-upload">
              {currentEmbedUrl ? "Edit Video" : "Upload Video"}
            </Label>
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
                Selected: {selectedFile.name} (
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
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
                {currentEmbedUrl ? "Edit Video" : "Upload Video"}
              </>
            )}
          </Button>
        </div>
      </div>

      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Video Preview</DialogTitle>
          </DialogHeader>
          {currentEmbedUrl && (
            <div className="aspect-video rounded-lg overflow-hidden border bg-black">
              <iframe
                src={currentEmbedUrl}
                className="w-full h-full"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
