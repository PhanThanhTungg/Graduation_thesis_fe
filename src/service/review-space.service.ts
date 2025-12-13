import { get, post } from "@/lib/request";
import { LessonReviewSettingType } from "@/schema/review-space.schema";

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

export const getReviewSpaceLessons = async (): Promise<
  LessonReviewSettingType[]
> => {
  const response = await get<LessonReviewSettingType[]>(
    "/api/review-space/lessons",
    undefined,
  );

  if (response.status === 200) {
    return response.payload as LessonReviewSettingType[];
  }

  const errorMessage =
    typeof response.payload === "object" &&
    response.payload !== null &&
    "message" in response.payload &&
    typeof response.payload.message === "string"
      ? response.payload.message
      : "Failed to fetch review space lessons";

  throw new Error(errorMessage);
};
