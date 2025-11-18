"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { checkPurchase } from "@/service/payment.service";
import { getNextLessonByCourseSlug } from "@/service/lesson.service";

type CourseActionButtonProps = {
  courseId: string;
  courseSlug: string;
};

export default function CourseActionButton({
  courseId,
  courseSlug,
}: CourseActionButtonProps) {
  const [hasPurchased, setHasPurchased] = useState<boolean | null>(null);
  const [nextLessonSlug, setNextLessonSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const [purchaseStatus, lessonSlug] = await Promise.all([
          checkPurchase(courseId).catch(() => ({ hasPurchased: false })),
          getNextLessonByCourseSlug(courseSlug).catch(() => null),
        ]);

        setHasPurchased(purchaseStatus.hasPurchased);
        setNextLessonSlug(lessonSlug);
      } catch {
        setHasPurchased(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [courseId, courseSlug]);

  if (isLoading) {
    return (
      <Button
        size="lg"
        className="bg-green hover:bg-green/90 text-secondary text-lg font-bold rounded-3xl px-6"
        disabled
      >
        Loading...
      </Button>
    );
  }

  const href = hasPurchased
    ? nextLessonSlug
      ? `/course/${courseSlug}/learn/${nextLessonSlug}`
      : `/course/${courseSlug}/learn`
    : `/courses/${courseSlug}/purchase`;

  const buttonText = hasPurchased ? "Start now" : "Buy now";

  return (
    <Button
      size="lg"
      className="bg-green hover:bg-green/90 text-secondary text-lg font-bold rounded-3xl px-6"
      asChild
    >
      <Link href={href}>{buttonText}</Link>
    </Button>
  );
}
