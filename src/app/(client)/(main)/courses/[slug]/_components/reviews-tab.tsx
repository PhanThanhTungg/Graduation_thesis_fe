"use client"

import { useEffect, useState, useCallback } from "react";
import { Star, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReviewForm from "./review-form";
import { getCourseReviews, getRatingOverview, createReviewReply } from "@/service/review.service";
import { ExtendedReview } from "@/schema/review.schema";
import { formatTimeAgo } from "@/lib/helpers";
import { showToast } from "@/lib/toast";
import { getCookie } from "@/lib/cookie";

interface ReviewsTabProps {
  courseId: string;
}

interface RatingStats {
  average: number;
  total: number;
  breakdown: { stars: number; count: number; percentage: number }[];
}

export default function ReviewsTab({ courseId }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<ExtendedReview[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats>({
    average: 0,
    total: 0,
    breakdown: [],
  });
  const [selectedRating, setSelectedRating] = useState<number | undefined>(undefined);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyComment, setReplyComment] = useState<string>("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchRatingOverview = useCallback(async () => {
    const response = await getRatingOverview(courseId);
    setRatingStats(response.data);
  }, [courseId]);

  const fetchReviews = useCallback(async (rating?: number, limit?: number) => {
    setIsLoading(true);
    const response = await getCourseReviews(courseId, rating, limit);
    setReviews(response.data.reviews);
    setTotalReviews(response.data.total);
    setIsLoading(false);
  }, [courseId]);

  const handleReviewSubmitted = (newReview: ExtendedReview) => {
    const reviewWithReplies = {
      ...newReview,
      replies: [],
      totalReplies: 0,
      hasMoreReplies: false,
    };
    setReviews([reviewWithReplies, ...reviews]);
    setTotalReviews(totalReviews + 1);
    
    fetchRatingOverview();
  };

  const handleReplySubmit = async (reviewId: string) => {
    if (!replyComment.trim()) {
      showToast("error", "Please enter a comment");
      return;
    }

    setIsSubmittingReply(true);
    const result = await createReviewReply(reviewId, { comment: replyComment });
    setIsSubmittingReply(false);

    if (result) {
      showToast("success", "Reply submitted successfully!");
      
      // Update reviews state locally
      setReviews(reviews.map(review => {
        if (review.id === reviewId) {
          return {
            ...review,
            replies: [...review.replies, {
              id: result.data.id,
              comment: result.data.comment,
              user: result.data.user,
              courseOwner: false, // Will be updated if needed
              createdAt: result.data.createdAt,
            }],
            totalReplies: review.totalReplies + 1,
          };
        }
        return review;
      }));
      
      // Reset reply form
      setReplyComment("");
      setReplyingTo(null);
    }
  };

  const handleRatingFilter = (rating: number) => {
    if (selectedRating === rating) {
      setSelectedRating(undefined);
      fetchReviews(undefined, showAllReviews ? 0 : 4);
    } else {
      setSelectedRating(rating);
      fetchReviews(rating, showAllReviews ? 0 : 4);
    }
  };

  const handleToggleShowAll = () => {
    const newShowAll = !showAllReviews;
    setShowAllReviews(newShowAll);
    fetchReviews(selectedRating, newShowAll ? 0 : 4);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getCookie('client_access_token');
      setIsAuthenticated(!!token);
    };
    checkAuth();
    fetchRatingOverview();
    fetchReviews(undefined, 4);
  }, [courseId, fetchRatingOverview, fetchReviews]);

  if (isLoading) {
    return (
      <div className="bg-card border border-t-0 border-border rounded-bl-[20px] rounded-br-[20px] p-[25px]">
        <div className="flex items-center justify-center py-10">
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-t-0 border-border rounded-bl-[20px] rounded-br-[20px] p-[25px]">
      <h3 className="text-xl font-semibold text-foreground mb-5">Comments</h3>

      {/* Review Form */}
      <ReviewForm courseId={courseId} onReviewSubmitted={handleReviewSubmitted} />

      {/* Rating Overview */}
      {ratingStats.total > 0 && (
        <div className="flex items-start gap-6 mb-6">
          {/* Average Rating */}
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-foreground mb-2">
              {ratingStats.average.toFixed(1)}
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
              based on {ratingStats.total.toLocaleString()} {ratingStats.total === 1 ? 'rating' : 'ratings'}
            </span>
          </div>

          {/* Rating Breakdown with Filter */}
          <div className="flex-1">
            {ratingStats.breakdown.map((stat) => (
              <button
                key={stat.stars}
                onClick={() => handleRatingFilter(stat.stars)}
                className={`flex items-center gap-3 mb-2 w-full rounded-md px-2 py-1 transition-colors ${
                  selectedRating === stat.stars
                    ? "bg-primary/10 ring-2 ring-primary/20"
                    : "hover:bg-muted/50"
                }`}
              >
                {/* Stars */}
                <div className="flex items-center gap-1 w-20">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${
                        i < stat.stars
                          ? "fill-star text-star"
                          : "fill-none text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>

                {/* Count */}
                <span className="text-sm text-muted-foreground w-12">
                  ({stat.count})
                </span>

                {/* Progress Bar */}
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-star rounded-full transition-all"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>

                {/* Percentage */}
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {stat.percentage}%
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Info */}
      {selectedRating && (
        <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Showing reviews with</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-3 ${
                    i < selectedRating
                      ? "fill-star text-star"
                      : "fill-none text-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRatingFilter(selectedRating)}
          >
            Clear filter
          </Button>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <>
          <div className="space-y-5 mb-6">
            {reviews.map((review) => (
              <div key={review.id} className="space-y-3">
                {/* Main Review */}
                <div className="flex gap-3 p-4 border border-border rounded-lg">
                  {/* Avatar */}
                  <Avatar className="size-10 flex-shrink-0">
                    <AvatarImage src={review.user.avatarUrl || undefined} alt={review.user.fullName} />
                    <AvatarFallback>{review.user.fullName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-semibold text-sm text-foreground">
                        {review.user.fullName}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(review.createdAt)}
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
                  {review.comment && (
                    <p className="text-sm text-foreground leading-relaxed mb-2">
                      {review.comment}
                    </p>
                  )}

                  {/* Reply Button */}
                  {isAuthenticated && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2 -ml-2"
                      onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                    >
                      <MessageSquare className="size-3 mr-1" />
                      Reply
                    </Button>
                  )}
                </div>
              </div>

              {/* Reply Form */}
              {replyingTo === review.id && (
                <div className="ml-12 mt-3 p-3 border border-border rounded-lg bg-muted/30">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyComment}
                    onChange={(e) => setReplyComment(e.target.value)}
                    rows={3}
                    className="resize-none mb-2"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleReplySubmit(review.id)}
                      disabled={isSubmittingReply || !replyComment.trim()}
                    >
                      {isSubmittingReply ? "Submitting..." : "Submit Reply"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyComment("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}                {/* Replies */}
                {review.replies && review.replies.length > 0 && (
                  <div className="ml-12 mt-3 space-y-3">
                    {review.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        {/* Reply Avatar */}
                        <Avatar className="size-8 flex-shrink-0">
                          <AvatarImage src={reply.user.avatarUrl || undefined} alt={reply.user.fullName} />
                          <AvatarFallback>{reply.user.fullName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>

                        {/* Reply Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm text-foreground">
                              {reply.user.fullName}
                            </h4>
                            {reply.courseOwner && (
                              <Badge variant="default" className="text-[10px] px-2 py-0">
                                Teacher
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              · {formatTimeAgo(reply.createdAt)}
                            </span>
                          </div>

                          {/* Reply Comment */}
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {reply.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Show More Replies Button */}
                    {review.hasMoreReplies && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                      >
                        Show {review.totalReplies - review.replies.length} more {review.totalReplies - review.replies.length === 1 ? 'reply' : 'replies'}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Show All / Collapse Button */}
          {totalReviews > 4 && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleToggleShowAll}
              >
                {showAllReviews ? 'Show less reviews' : `Show all ${totalReviews} reviews`}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-lg font-semibold text-muted-foreground mb-2">
            {selectedRating ? 'No reviews with this rating' : 'No reviews yet'}
          </p>
          <p className="text-sm text-muted-foreground">
            {selectedRating ? 'Try selecting a different rating filter' : 'Be the first to review this course!'}
          </p>
        </div>
      )}
    </div>
  );
}
