"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { CreateNoteBodyType } from "@/schema/note.schema";
import eventBus from "@/lib/event-bus";

interface AddNoteFormProps {
  lessonId: string;
  onSubmit: (data: CreateNoteBodyType) => Promise<void>;
}

export function AddNoteForm({ lessonId, onSubmit }: AddNoteFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState(0);

  // Listen to video timestamp updates from event bus (realtime)
  useEffect(() => {
    const handleTimeUpdate = (timestamp: number) => {
      setCurrentTimestamp(timestamp);
    };

    eventBus.on<number>("video:timeupdate", handleTimeUpdate);

    return () => {
      eventBus.off<number>("video:timeupdate", handleTimeUpdate);
    };
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        lessonId,
        content: content.trim(),
        timestamp: currentTimestamp,
      });
      // Reset form after successful submission
      setContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayTimestamp = () => {
    const min = Math.floor(currentTimestamp / 60);
    const sec = currentTimestamp % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-muted rounded-lg p-6">
      <h3 className="font-heading text-lg font-semibold mb-4">Add a Note</h3>
      <div className="space-y-4">
        {/* Timestamp Display */}
        <Label className="text-sm font-medium">Video Timestamp: {displayTimestamp()}</Label>

        {/* Note Content */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Note Content</Label>
          <Textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="resize-none"
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="bg-orange hover:bg-orange/90 text-primary-foreground"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Note"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
