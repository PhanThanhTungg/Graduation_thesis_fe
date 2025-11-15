import { z } from "zod";
import { ShortUserSchema } from "./user.schema";

export const ReviewSchema = z.object({
  id: z.uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).strip();
export type Review = z.infer<typeof ReviewSchema>;

export const CreateReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string(),
}).strip();
export type CreateReview = z.infer<typeof CreateReviewSchema>;

export const UpdateReviewSchema = CreateReviewSchema.partial();
export type UpdateReview = z.infer<typeof UpdateReviewSchema>;

export const ReviewReplySchema = z.object({
  id: z.uuid(),
  comment: z.string(),
  user: ShortUserSchema,
  courseOwner: z.boolean(),
  createdAt: z.string(),
})

export const CreateReviewReplySchema = z.object({
  comment: z.string()
}).strip();
export type CreateReviewReply = z.infer<typeof CreateReviewReplySchema>;

export const ExtendedReviewSchema = ReviewSchema.extend({
  user: ShortUserSchema,
  replies: z.array(ReviewReplySchema),
  totalReplies: z.number(),
  hasMoreReplies: z.boolean(),
}).strip()
export type ExtendedReview = z.infer<typeof ExtendedReviewSchema>;

export const GetCourseReviewsResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    reviews: z.array(ExtendedReviewSchema),
    total: z.number(),
    showing: z.number(),
    hasMore: z.boolean(),
  }),
}).strip()
export type GetCourseReviewsResponse = z.infer<typeof GetCourseReviewsResponseSchema>;

export const RatingOverviewSchema = z.object({
  message: z.string(),
  data: z.object({
    average: z.number(),
    total: z.number(),
    breakdown: z.array(
      z.object({
        stars: z.number(),
        count: z.number(),
        percentage: z.number(),
      })
    ),
  }),
}).strip()
export type RatingOverviewResponse = z.infer<typeof RatingOverviewSchema>;

export type ReviewResponse = {
  message: string;
  data: ExtendedReview;
};

export type ReviewReplyResponse = {
  message: string;
  data: {
    id: string;
    comment: string;
    user: {
      id: string;
      fullName: string;
      email: string;
      avatarUrl: string | null;
    };
    createdAt: string;
    updatedAt: string;
  };
};