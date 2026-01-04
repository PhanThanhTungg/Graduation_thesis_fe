"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { showToast } from "@/lib/toast";

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  useEffect(() => {
    showToast("info", "Payment cancelled");
    if (type === "deposit") {
      localStorage.removeItem("pendingDeposit");
      router.push("/teacher/finance");
    } else {
      localStorage.removeItem("pendingOrder");
      router.push("/");
    }
  }, [router, searchParams, type]);

  return (
    <div className="container-sm py-12">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Payment was cancelled.</p>
        <p className="text-sm text-muted-foreground mt-2">Redirecting...</p>
      </div>
    </div>
  );
}
