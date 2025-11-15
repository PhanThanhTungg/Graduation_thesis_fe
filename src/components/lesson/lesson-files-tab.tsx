"use client";

import React from "react";
import { File } from "lucide-react";

interface LessonFile {
  id: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

interface LessonFilesTabProps {
  files?: LessonFile[];
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

export function LessonFilesTab({ files }: LessonFilesTabProps) {
  if (!files || files.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <File className="w-16 h-16 mx-auto mb-4 text-[--color-muted-foreground]" />
          <p className="text-[--color-muted-foreground]">No files available for this lesson</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="font-heading text-2xl font-semibold mb-6">Lesson Files</h2>
      <div className="space-y-3">
        {files.map((file) => (
          <a
            key={file.id}
            href={file.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 border border-[--color-border] rounded-lg hover:bg-[--color-muted] transition-colors group"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-[--color-muted] rounded-lg flex items-center justify-center">
              <File className="w-6 h-6 text-[--color-muted-foreground] group-hover:text-[--color-orange] transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate group-hover:text-[--color-orange] transition-colors">
                {file.fileName}
              </h3>
              <p className="text-sm text-[--color-muted-foreground]">
                {formatFileSize(file.fileSize)}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

