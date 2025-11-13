"use client";

import React from "react";

interface VideoPlayerProps {
  embedUrl: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export function VideoPlayer({ embedUrl, title }: VideoPlayerProps) {
  console.log(embedUrl);
  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent z-10">
        <h3 className="text-white font-heading text-lg font-semibold">{title}</h3>
      </div>
      <iframe
        src={embedUrl}
        className="w-full aspect-video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
      />
    </div>
  );
}
