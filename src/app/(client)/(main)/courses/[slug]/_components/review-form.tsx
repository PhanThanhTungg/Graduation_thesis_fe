"use client"

import { useState, useEffect } from "react";
import { Star, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createReview } from "@/service/review.service";
import { showToast } from "@/lib/toast";
import { getCookie } from "@/lib/cookie";
import Link from "next/link";
import { ExtendedReview } from "@/schema/review.schema";

interface ReviewFormProps {
  courseId: string;
  onReviewSubmitted?: (review: ExtendedReview) => void;
}

export default function ReviewForm({ courseId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getCookie('client_access_token');
      setIsAuthenticated(!!token);
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      showToast("error", "Please select a rating");
      return;
    }

    setIsSubmitting(true);
    
    const result = await createReview(courseId, {
      rating,
      comment: comment,
    });

    setIsSubmitting(false);

    if (result) {
      showToast("success", "Review submitted successfully!");
      setRating(0);
      setComment("");
      onReviewSubmitted?.(result.data);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="mb-8 p-5 border border-border rounded-lg bg-muted/30">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mb-8 p-5 border border-border rounded-lg bg-muted/30">
        <div className="flex items-center gap-3">
          <LogIn className="size-5 text-muted-foreground" />
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1">Sign in to leave a review</h4>
            <p className="text-sm text-muted-foreground mb-3">
              You need to be logged in to share your thoughts about this course.
            </p>
            <Link href="/auth/login">
              <Button size="sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 p-5 border border-border rounded-lg bg-muted/30">
      <h4 className="font-semibold text-foreground mb-4">Leave a Review</h4>
      
      {/* Rating Input */}
      <div className="mb-4">
        <Label className="text-sm font-medium text-foreground mb-2 block">
          Your Rating
        </Label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;
            const isActive = starValue <= (hoveredRating || rating);
            
            return (
              <button
                key={index}
                type="button"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoveredRating(starValue)}
                onMouseLeave={() => setHoveredRating(0)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "size-8 transition-colors",
                    isActive
                      ? "fill-star text-star"
                      : "fill-none text-muted-foreground"
                  )}
                />
              </button>
            );
          })}
          {rating > 0 && (
            <span className="ml-2 text-sm text-muted-foreground">
              {rating} {rating === 1 ? "star" : "stars"}
            </span>
          )}
        </div>
      </div>

      {/* Comment Input */}
      <div className="mb-4">
        <Label htmlFor="comment" className="text-sm font-medium text-foreground mb-2 block">
          Your Comment (Optional)
        </Label>
        <Textarea
          id="comment"
          placeholder="Share your thoughts about this course..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmitReview}
        disabled={isSubmitting || rating === 0}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  );
}
