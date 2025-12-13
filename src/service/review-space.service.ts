import { post } from "@/lib/request";

export const toggleLessonInReviewSpace = async (
  lessonId: string,
): Promise<{ message: string; data: { isInReviewSpace: boolean } }> => {
  const response = await post<{
    message: string;
    data: { isInReviewSpace: boolean };
  }>(`/api/review-space/lessons/${lessonId}`, {});

  if (response.status === 200 || response.status === 201) {
    return response.payload as {
      message: string;
      data: { isInReviewSpace: boolean };
    };
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to toggle lesson in review space",
  );
};

// Keep old name for backward compatibility
export const addLessonToReviewSpace = toggleLessonInReviewSpace;
