"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import LoadingAnimation from "@/components/custom/loading-animation";

export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    const error = url.searchParams.get("error");

    if (error) {
      showToast("error", `Google login failed: ${error}`);
      router.replace("/login");
      return;
    }

    if (token) {
      document.cookie = `client_access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      router.replace("/");
      return;
    }

    showToast("error", "Authentication failed. Please try again.");
    router.replace("/login");
  }, [router]);

  return (
    <div className="w-screen h-dvh flex items-center justify-center">
      <LoadingAnimation />
    </div>
  );
}
