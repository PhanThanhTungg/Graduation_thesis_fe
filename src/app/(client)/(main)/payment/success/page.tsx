"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { capturePaypalOrder } from "@/service/payment.service";
import { captureDeposit } from "@/service/finance.service";
import { showToast } from "@/lib/toast";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const type = searchParams.get("type");

  useEffect(() => {
    const processPayment = async () => {
      const token = searchParams.get("token");
      if (!token) {
        showToast("error", "Missing payment token");
        router.push("/teacher/finance");
        return;
      }

      try {
        if (type === "deposit") {
          const pendingDepositStr = localStorage.getItem("pendingDeposit");
          if (!pendingDepositStr) {
            showToast("error", "Deposit session not found");
            router.push("/teacher/finance");
            return;
          }

          const pendingDeposit = JSON.parse(pendingDepositStr);
          await captureDeposit(pendingDeposit.transactionId, token);
          localStorage.removeItem("pendingDeposit");
          showToast("success", "Deposit completed successfully");
          router.push("/teacher/finance");
        } else {
          const pendingOrderStr = localStorage.getItem("pendingOrder");
          if (!pendingOrderStr) {
            showToast("error", "Order session not found");
            router.push("/");
            return;
          }

          const pendingOrder = JSON.parse(pendingOrderStr);
          await capturePaypalOrder(pendingOrder.orderId, token);
          localStorage.removeItem("pendingOrder");
          showToast("success", "Payment completed successfully");
          router.push("/my-learning");
        }
      } catch (error) {
        showToast(
          "error",
          error instanceof Error ? error.message : "Failed to process payment",
        );
        router.push(type === "deposit" ? "/teacher/finance" : "/");
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [router, searchParams, type]);

  return (
    <div className="container-sm py-12">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Processing your payment...</p>
          </>
        ) : (
          <p className="text-muted-foreground">Redirecting...</p>
        )}
      </div>
    </div>
  );
}
