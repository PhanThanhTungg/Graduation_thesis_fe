import { get, patch, post } from "@/lib/request";
import { showToast } from "@/lib/toast";
import {
  CreateReview,
  UpdateReview,
  CreateReviewReply,
  GetCourseReviewsResponse,
  RatingOverviewResponse,
  ReviewResponse,
  ReviewReplyResponse,
} from "@/schema/review.schema";
import { redirect } from "next/navigation";


export const createReview = async (
  courseId: string,
  data: CreateReview
): Promise<ReviewResponse | null> => {
  const response = await post<ReviewResponse>(
    `api/review/course/${courseId}`,
    data,
  );

  if (response.status !== 201 && response.status !== 200) {
    showToast("error", (response.payload as any).message || "Failed to create review");
    return null;
  }

  return response.payload as ReviewResponse;
};

export const updateReview = async (
  courseId: string,
  data: UpdateReview
): Promise<ReviewResponse | null> => {
  const response = await patch<ReviewResponse>(
    `api/review/course/${courseId}`,
    data,
  );

  if (response.status !== 200) {
    showToast("error", (response.payload as any).message || "Failed to update review");
    return null;
  }

  return response.payload as ReviewResponse;
};

export const getRatingOverview = async (
  courseId: string
): Promise<RatingOverviewResponse> => {
  const response = await get<RatingOverviewResponse>(
    `api/review/course/${courseId}/overview`,
    undefined,
  );

  if (response.status !== 200) {
    redirect('/error-fetch-data')
  }

  return response.payload as RatingOverviewResponse;
};

export const getCourseReviews = async (
  courseId: string,
  rating?: number,
  limit?: number,
): Promise<GetCourseReviewsResponse> => {
  const params = new URLSearchParams();
  if (rating !== undefined) params.append('rating', rating.toString());
  if (limit !== undefined) params.append('limit', limit.toString());
  
  const queryString = params.toString();
  const url = `api/review/course/${courseId}${queryString ? `?${queryString}` : ''}`;

  const response = await get<GetCourseReviewsResponse>(url, undefined);

  if (response.status !== 200) {
    redirect('/error-fetch-data')
  }

  const payload = response.payload as GetCourseReviewsResponse;

  return payload;
};


export const createReviewReply = async (
  reviewId: string,
  data: CreateReviewReply
): Promise<ReviewReplyResponse | null> => {
  const response = await post<ReviewReplyResponse>(
    `api/review/${reviewId}/reply`,
    data,
  );

  if (response.status !== 201 && response.status !== 200) {
    showToast("error", (response.payload as any).message || "Failed to create reply");
    return null;
  }

  return response.payload as ReviewReplyResponse;
};
