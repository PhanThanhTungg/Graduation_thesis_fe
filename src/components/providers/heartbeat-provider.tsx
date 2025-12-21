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
      sendHeartbeat();
    }, 10000);

    const handleBeforeUnload = () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("client_access_token="))
        ?.split("=")[1];

      if (token) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const url = `${baseUrl}/api/user/update-last-login`;

        fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          keepalive: true,
          credentials: "include",
          body: JSON.stringify({}),
        }).catch(() => {});
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return <>{children}</>;
}
