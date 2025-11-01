"use client";

import React from "react";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  date: Date;
  content: string;
}

interface LessonReviewsTabProps {
  courseId: number;
}

export function LessonReviewsTab({ courseId }: LessonReviewsTabProps) {
  // Mock data - in real app, fetch from API
  const reviews: Review[] = [
    {
      id: 1,
      userName: "Sarah Johnson",
      userAvatar: "https://res.cloudinary.com/dndo7fe82/image/upload/v1757212590/hwqsskrgmbbo9f4gu6uf.webp",
      rating: 5,
      date: new Date("2024-01-10"),
      content:
        "Excellent course! The instructor explains everything clearly and the hands-on projects really help reinforce the concepts. Highly recommended for anyone wanting to learn LearnPress.",
    },
    {
      id: 2,
      userName: "Michael Chen",
      userAvatar: "https://res.cloudinary.com/dndo7fe82/image/upload/v1757212590/hwqsskrgmbbo9f4gu6uf.webp",
      rating: 5,
      date: new Date("2024-01-08"),
      content:
        "Great content and well-structured lessons. I was able to build my first LMS website within a week of starting this course. The support from the instructor is also fantastic.",
    },
    {
      id: 3,
      userName: "Emma Williams",
      userAvatar: "https://res.cloudinary.com/dndo7fe82/image/upload/v1757212590/hwqsskrgmbbo9f4gu6uf.webp",
      rating: 4,
      date: new Date("2024-01-05"),
      content:
        "Very comprehensive course covering all aspects of LearnPress. The only reason I'm giving 4 stars instead of 5 is that I wish there were more advanced customization examples.",
    },
    {
      id: 4,
      userName: "David Brown",
      userAvatar: "https://res.cloudinary.com/dndo7fe82/image/upload/v1757212590/hwqsskrgmbbo9f4gu6uf.webp",
      rating: 5,
      date: new Date("2024-01-03"),
      content:
        "Best LearnPress course I've taken! Clear explanations, practical examples, and excellent pacing. Worth every penny.",
    },
  ];

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="p-6">
      {/* Rating Overview */}
      <div className="mb-8 pb-6 border-b">
        <h2 className="font-heading text-2xl font-semibold mb-4">Student Reviews</h2>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? "fill-[--color-star] text-[--color-star]"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-[--color-muted-foreground]">
              {reviews.length} reviews
            </p>
          </div>

          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter((r) => r.rating === rating).length;
              const percentage = (count / reviews.length) * 100;

              return (
                <div key={rating} className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm">{rating}</span>
                    <Star className="w-4 h-4 fill-[--color-star] text-[--color-star]" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[--color-star]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-[--color-muted-foreground] w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="pb-6 border-b last:border-0">
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={review.userAvatar} alt={review.userName} />
                <AvatarFallback>{getInitials(review.userName)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{review.userName}</h4>
                    <p className="text-sm text-[--color-muted-foreground]">
                      {formatDate(review.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "fill-[--color-star] text-[--color-star]"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[--color-muted-foreground] leading-relaxed">
                  {review.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
