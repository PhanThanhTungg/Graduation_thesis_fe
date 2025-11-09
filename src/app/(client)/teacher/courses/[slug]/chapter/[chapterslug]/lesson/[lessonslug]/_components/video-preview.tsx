"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye } from "lucide-react"

interface VideoPreviewProps {
  videoId?: string | null
  embedUrl?: string | null
}

export function VideoPreview({
  videoId,
  embedUrl,
}: VideoPreviewProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  if (!embedUrl) {
    return null
  }

  return (
    <div className="space-y-4 pt-4 border-t">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Video</h3>
        <div className="p-4 border rounded-lg bg-accent/50">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Video uploaded</p>
              {videoId && (
                <p className="text-xs text-muted-foreground">
                  Video ID: {videoId}
                </p>
              )}
              <p className="text-xs text-muted-foreground break-all">
                {embedUrl}
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
      </div>

      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Video Preview</DialogTitle>
          </DialogHeader>
          {embedUrl && (
            <div className="aspect-video rounded-lg overflow-hidden border bg-black">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

