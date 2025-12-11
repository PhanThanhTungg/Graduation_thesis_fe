import { post } from "@/lib/request";

export const addLessonToReviewSpace = async (
  lessonId: number,
): Promise<{ message: string }> => {
  const response = await post<{ message: string }>(
    `/api/review-space/lessons/${lessonId}`,
    {},
  );

  if (response.status === 200 || response.status === 201) {
    return response.payload as { message: string };
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to add lesson to review space",
  );
};
