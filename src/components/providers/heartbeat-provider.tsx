"use client";

import { useEffect, useRef } from "react";
import { post } from "@/lib/request";

export function HeartbeatProvider({ children }: { children: React.ReactNode }) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        await post("/api/user/heartbeat", {});
      } catch (error) {
        console.error("Heartbeat failed:", error);
      }
    };

    sendHeartbeat();

    intervalRef.current = setInterval(() => {
      console.log("Sending heartbeat");
      sendHeartbeat();
    }, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return <>{children}</>;
}
