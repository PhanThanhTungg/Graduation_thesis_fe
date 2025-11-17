"use client";

import React, { useEffect, useRef } from "react";
import eventBus from "@/lib/event-bus";
import Script from "next/script";

// Declare player.js types
interface BunnyPlayer {
  on: (event: string, callback: (data?: any) => void) => void;
  off: (event: string, callback?: (data?: any) => void) => void;
  ready: () => void;
  play: () => void;
  pause: () => void;
  getCurrentTime: (callback: (time: number) => void) => void;
  getDuration: (callback: (duration: number) => void) => void;
  setCurrentTime: (time: number) => void;
  supports: (type: "method" | "event", name: string) => boolean;
}

declare global {
  interface Window {
    playerjs?: {
      Player: new (iframe: HTMLIFrameElement | string) => BunnyPlayer;
    };
  }
}

interface VideoPlayerProps {
  embedUrl: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export function VideoPlayer({ embedUrl, title }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<BunnyPlayer | null>(null);

  useEffect(() => {
    // Wait for both iframe and player.js library to be ready
    const initPlayer = () => {
      if (!iframeRef.current || !window.playerjs) {
        return;
      }

      try {
        // Create player instance
        const player = new window.playerjs.Player(iframeRef.current);
        playerRef.current = player;

        // Wait for player to be ready
        player.on("ready", () => {
          console.log("Bunny Stream player ready");

          // Listen to timeupdate event
          player.on("timeupdate", (data: { seconds: number; duration: number }) => {
            // Emit current timestamp to event bus (in seconds)
            const timestamp = Math.floor(data.seconds);
            eventBus.emit("video:timeupdate", timestamp);
          });

          // Optional: Listen to other events for debugging
          player.on("play", () => {
            console.log("Video playing");
          });

          player.on("pause", () => {
            console.log("Video paused");
          });

          player.on("ended", () => {
            console.log("Video ended");
          });
        });
      } catch (error) {
        console.error("Failed to initialize Bunny Stream player:", error);
      }
    };

    // Try to initialize immediately if library is already loaded
    if (window.playerjs) {
      initPlayer();
    }

    // Cleanup function
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.off("ready");
          playerRef.current.off("timeupdate");
          playerRef.current.off("play");
          playerRef.current.off("pause");
          playerRef.current.off("ended");
        } catch (error) {
          console.debug("Error cleaning up player:", error);
        }
        playerRef.current = null;
      }
    };
  }, []);

  // Handle player.js script load
  const handleScriptLoad = () => {
    console.log("Player.js library loaded");
    // Initialize player after script loads
    if (iframeRef.current && window.playerjs) {
      const player = new window.playerjs.Player(iframeRef.current);
      playerRef.current = player;

      player.on("ready", () => {
        console.log("Bunny Stream player ready");

        player.on("timeupdate", (data: { seconds: number; duration: number }) => {
          const timestamp = Math.floor(data.seconds);
          eventBus.emit("video:timeupdate", timestamp);
        });
      });
    }
  };

  return (
    <>
      {/* Load player.js library from Bunny CDN */}
      <Script
        src="https://assets.mediadelivery.net/playerjs/playerjs-latest.min.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      
      <div className="relative w-full bg-black rounded-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent z-10">
          <h3 className="text-white font-heading text-lg font-semibold">{title}</h3>
        </div>
        <iframe
          ref={iframeRef}
          id="bunny-stream-player"
          src={embedUrl}
          className="w-full aspect-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
      </div>
    </>
  );
}
