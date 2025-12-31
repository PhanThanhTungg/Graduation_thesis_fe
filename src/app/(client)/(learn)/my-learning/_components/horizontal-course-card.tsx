"use client";

import { CourseType } from "@/schema/course.schema";
import { BookOpen, Star, User, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDateToString } from "@/lib/helpers";
import { useEffect, useState } from "react";
import { getNextLessonByCourseSlug } from "@/service/lesson.service";

type CourseWithProgress = CourseType & {
  progress?: {
    completedLessons: number;
    totalLessons: number;
    percentage: number;
  };
  purchasedAt?: Date | string;
  originalPrice?: number;
  finalPrice?: number;
  discountAmount?: number;
  category?: {
    id: string;
    title: string;
    slug: string;
    parentId?: string | null;
  };
};

export default function HorizontalCourseCard({
  course,
}: {
  course: CourseWithProgress;
}) {
  const progress = course.progress || {
    completedLessons: 0,
    totalLessons: 0,
    percentage: 0,
  };
  const [learnUrl, setLearnUrl] = useState<string>(
    `/course/${course.slug}/learn`,
  );

  useEffect(() => {
    const fetchNextLesson = async () => {
      try {
        const nextLessonSlug = await getNextLessonByCourseSlug(course.slug);
        if (nextLessonSlug) {
          setLearnUrl(`/course/${course.slug}/learn/${nextLessonSlug}`);
        }
      } catch (error) {
        console.error("Failed to fetch next lesson:", error);
      }
    };

    fetchNextLesson();
  }, [course.slug]);

  return (
    <Link href={learnUrl} className="group block">
      <div className="bg-card border rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-green/10 transition-all duration-300 hover:-translate-y-1">
        <div className="flex gap-4 p-5">
          <div className="relative w-44 h-32 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/50">
            <Image
              src={course.thumbnailUrl || "/placeholder-course.jpg"}
              alt={course.title}
              fill
              sizes="176px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {course.category && (
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green bg-green/10 px-2 py-1 rounded-full border border-green/20">
                        <BookOpen className="size-3" />
                        {course.category.title}
                      </span>
                    </div>
                  )}

                  <h3 className="font-bold text-xl mb-2 line-clamp-2 group-hover:text-green transition-colors duration-300">
                    {course.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <User className="size-3.5" />
                      <span>{course.teacher.fullName}</span>
                    </div>
                    {course.purchasedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        <span>{formatDateToString(course.purchasedAt)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-green to-green/80 transition-all duration-500 rounded-full shadow-sm"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                      <span className="font-medium text-green whitespace-nowrap">
                        {progress.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    {course.originalPrice &&
                    course.finalPrice &&
                    course.originalPrice > course.finalPrice ? (
                      <>
                        <span className="text-xs text-muted-foreground line-through">
                          ${course.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-lg font-bold text-green">
                          ${course.finalPrice.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-green">
                        $
                        {course.finalPrice?.toFixed(2) ||
                          course.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 bg-star/10 px-2 py-1 rounded-lg border border-star/20">
                  <Star className="size-3.5 fill-star text-star" />
                  <span className="font-semibold text-sm text-star">
                    {course.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
