"use client";

import { useCallback, useMemo, useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { applyVoucher } from "@/service/voucher.service";
import { showToast } from "@/lib/toast";
import {
  createPaypalOrder,
  capturePaypalOrder,
} from "@/service/payment.service";
import { useRouter } from "next/navigation";
import { getNextLessonByCourseSlug } from "@/service/lesson.service";

type CheckoutClientProps = {
  course: {
    id: string;
    slug: string;
    title: string;
    price: number;
  };
  nextLessonSlug: string | null;
};

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export default function CheckoutClient({
  course,
  nextLessonSlug,
}: CheckoutClientProps) {
  const router = useRouter();
  const [voucherCode, setVoucherCode] = useState("");
  const [priceInfo, setPriceInfo] = useState(() => ({
    finalPrice: course.price,
    discountAmount: 0,
  }));
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<{
    orderId: string;
    paypalOrderId?: string;
  } | null>(null);

  const alreadyOwned = Boolean(nextLessonSlug);
  const isFree = priceInfo.finalPrice <= 0;

  const summaryItems = useMemo(() => {
    return [
      {
        label: "Original price",
        value: formatPrice(course.price),
      },
      ...(priceInfo.discountAmount > 0
        ? [
            {
              label: "Voucher discount",
              value: `- ${formatPrice(priceInfo.discountAmount)}`,
            },
          ]
        : []),
      {
        label: "Total",
        value: formatPrice(priceInfo.finalPrice),
      },
    ];
  }, [course.price, priceInfo.discountAmount, priceInfo.finalPrice]);

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      showToast("error", "Please enter a voucher code");
      return;
    }
    setIsApplying(true);
    try {
      const result = await applyVoucher(voucherCode.trim(), course.id);
      if (!result.isValid || typeof result.finalPrice !== "number") {
        showToast("error", result.message || "Voucher is invalid");
        return;
      }
      setPriceInfo({
        finalPrice: result.finalPrice,
        discountAmount: Math.max(course.price - result.finalPrice, 0),
      });
      setAppliedVoucher(voucherCode.trim());
      showToast("success", "Voucher applied");
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Unable to apply voucher",
      );
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode("");
    setPriceInfo({
      finalPrice: course.price,
      discountAmount: 0,
    });
  };

  const redirectToLearning = useCallback(
    async (fallbackSlug?: string | null) => {
      const slug =
        fallbackSlug ||
        (await getNextLessonByCourseSlug(course.slug).catch(() => null));
      if (slug) {
        router.push(`/course/${course.slug}/learn/${slug}`);
      } else {
        router.push(`/course/${course.slug}/learn`);
      }
    },
    [course.slug, router],
  );

  const handleFreeCheckout = async () => {
    setIsProcessing(true);
    try {
      await createPaypalOrder({
        courseId: course.id,
        voucherCode: appliedVoucher || undefined,
      });
      showToast("success", "You now own this course");
      await redirectToLearning(nextLessonSlug);
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Unable to complete checkout",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateOrder = useCallback(async () => {
    setIsProcessing(true);
    try {
      const order = await createPaypalOrder({
        courseId: course.id,
        voucherCode: appliedVoucher || undefined,
      });

      if (!order.paypalOrderId) {
        throw new Error("Missing PayPal order id");
      }

      setCurrentOrder({
        orderId: order.orderId,
        paypalOrderId: order.paypalOrderId,
      });

      return order.paypalOrderId;
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Unable to start payment",
      );
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [appliedVoucher, course.id]);

  const handleCapture = useCallback(
    async (paypalOrderId: string) => {
      if (!currentOrder) {
        showToast("error", "Order reference is missing");
        return;
      }

      setIsProcessing(true);
      try {
        await capturePaypalOrder(currentOrder.orderId, paypalOrderId);
        showToast("success", "Payment completed");
        await redirectToLearning(nextLessonSlug);
      } catch (error) {
        showToast(
          "error",
          error instanceof Error ? error.message : "Unable to capture payment",
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [currentOrder, nextLessonSlug, redirectToLearning],
  );

  return (
    <aside className="rounded-[20px] border bg-card p-6 space-y-6 h-fit">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground">Payment</h2>
        <p className="text-sm text-muted-foreground">
          Pay securely with PayPal. Your access activates immediately after a
          successful payment.
        </p>
      </div>

      {alreadyOwned && (
        <div className="rounded-xl border border-green/40 bg-green-foreground px-4 py-3 text-sm leading-relaxed">
          You already own this course. Continue learning anytime.
          <Button
            variant="link"
            className="px-0 text-green font-semibold"
            onClick={() => redirectToLearning(nextLessonSlug)}
          >
            Go to lessons
          </Button>
        </div>
      )}

      <section className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Voucher code
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="Enter voucher"
            value={voucherCode}
            onChange={(event) => setVoucherCode(event.target.value)}
            disabled={isApplying || alreadyOwned}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleApplyVoucher}
            disabled={isApplying || alreadyOwned}
          >
            {isApplying ? "Checking..." : "Apply"}
          </Button>
        </div>
        {appliedVoucher && (
          <button
            type="button"
            className="text-sm font-medium text-destructive"
            onClick={handleRemoveVoucher}
            disabled={isApplying}
          >
            Remove voucher ({appliedVoucher})
          </button>
        )}
      </section>

      <section className="space-y-2">
        {summaryItems.map((item) => (
          <div
            className="flex items-center justify-between text-sm"
            key={item.label}
          >
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-semibold">{item.value}</span>
          </div>
        ))}
      </section>

      {!alreadyOwned && (
        <>
          {isFree ? (
            <Button
              className="w-full bg-green hover:bg-green/90 text-secondary"
              size="lg"
              onClick={handleFreeCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? "Completing..." : "Complete enrollment"}
            </Button>
          ) : paypalClientId ? (
            <PayPalScriptProvider
              options={{
                clientId: paypalClientId,
                currency: "USD",
              }}
            >
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={async () => {
                  const paypalOrderId = await handleCreateOrder();
                  return paypalOrderId;
                }}
                onApprove={async (data) => {
                  const reference = data.orderID || currentOrder?.paypalOrderId;
                  if (!reference) {
                    showToast("error", "Missing PayPal confirmation");
                    return;
                  }
                  await handleCapture(reference);
                }}
                onError={(error) => {
                  showToast(
                    "error",
                    error instanceof Error
                      ? error.message
                      : "PayPal could not process your payment",
                  );
                }}
                onCancel={() => {
                  showToast("info", "Payment cancelled");
                }}
                disabled={isProcessing}
              />
            </PayPalScriptProvider>
          ) : (
            <p className="text-sm text-destructive">
              PayPal client id is missing. Update NEXT_PUBLIC_PAYPAL_CLIENT_ID.
            </p>
          )}
        </>
      )}
    </aside>
  );
}
