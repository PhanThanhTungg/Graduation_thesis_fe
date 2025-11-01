"use client"

import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CoursePagination from "../../_components/course-pagination";

interface Review {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

const mockReviews: Review[] = [
  {
    id: 1,
    author: "John Doe",
    avatar: "/placeholder-avatar.jpg",
    rating: 5,
    date: "2 days ago",
    comment:
      "This course is amazing! I learned so much and the instructor explains everything clearly. Highly recommended!",
  },
  {
    id: 2,
    author: "Jane Smith",
    avatar: "/placeholder-avatar.jpg",
    rating: 4,
    date: "1 week ago",
    comment:
      "Great content and well-structured lessons. Would have given 5 stars if there were more practical examples.",
  },
  {
    id: 3,
    author: "Mike Johnson",
    avatar: "/placeholder-avatar.jpg",
    rating: 5,
    date: "2 weeks ago",
    comment: "Excellent course! The curriculum is comprehensive and easy to follow.",
  },
];

const ratingStats = {
  average: 4.0,
  total: 146951,
  breakdown: [
    { stars: 5, percentage: 90 },
    { stars: 4, percentage: 5 },
    { stars: 3, percentage: 2 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 1 },
  ],
};

export default function ReviewsTab() {
  return (
    <div className="bg-card border border-t-0 border-border rounded-bl-[20px] rounded-br-[20px] p-[25px]">
      <h3 className="text-xl font-semibold text-foreground mb-5">Comments</h3>

      {/* Rating Overview */}
      <div className="flex items-start gap-6 mb-6">
        {/* Average Rating */}
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold text-foreground mb-2">
            {ratingStats.average}
          </span>
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-4 ${
                  i < Math.floor(ratingStats.average)
                    ? "fill-star text-star"
                    : "fill-none text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            based on {ratingStats.total.toLocaleString()} ratings
          </span>
        </div>

        {/* Rating Breakdown */}
        <div className="flex-1">
          {ratingStats.breakdown.map((stat) => (
            <div key={stat.stars} className="flex items-center gap-3 mb-2">
              {/* Stars */}
              <div className="flex items-center gap-1 w-20">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-star text-star"
                  />
                ))}
              </div>

              {/* Percentage Text */}
              <span className="text-sm text-muted-foreground w-12">
                {stat.percentage}%
              </span>

              {/* Progress Bar */}
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-star rounded-full"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-5 mb-6">
        {mockReviews.map((review) => (
          <div
            key={review.id}
            className="flex gap-3 p-4 border border-border rounded-lg"
          >
            {/* Avatar */}
            <Avatar className="size-10 flex-shrink-0">
              <AvatarImage src={review.avatar} alt={review.author} />
              <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
            </Avatar>

            {/* Review Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="font-semibold text-sm text-foreground">
                  {review.author}
                </h4>
                <span className="text-xs text-muted-foreground">
                  {review.date}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-3 ${
                      i < review.rating
                        ? "fill-star text-star"
                        : "fill-none text-muted-foreground"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-sm text-foreground leading-relaxed">
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <CoursePagination totalPages={3} />
      </div>
    </div>
  );
}
