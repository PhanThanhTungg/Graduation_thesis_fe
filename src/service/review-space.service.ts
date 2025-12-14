import { get, post, patch } from "@/lib/request";
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

export const getReviewSpaceLessons = async (params?: {
  page?: number;
  limit?: number;
}): Promise<{
  data: LessonReviewSettingType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const queryParams: Record<string, unknown> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;

  const response = await get<{
    data: LessonReviewSettingType[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>("/api/review-space/lessons", queryParams);

  if (response.status === 200) {
    return response.payload as {
      data: LessonReviewSettingType[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
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

export const getLessonReviewSettingByLessonId = async (
  lessonId: string,
): Promise<LessonReviewSettingType> => {
  const response = await get<LessonReviewSettingType>(
    `/api/review-space/lessons/${lessonId}`,
    undefined,
  );

  if (response.status === 200) {
    return response.payload as LessonReviewSettingType;
  }

  const errorMessage =
    typeof response.payload === "object" &&
    response.payload !== null &&
    "message" in response.payload &&
    typeof response.payload.message === "string"
      ? response.payload.message
      : "Failed to fetch lesson review setting";

  throw new Error(errorMessage);
};

export const updateLessonReviewSetting = async (
  lessonId: string,
  data: { reviewEnabled?: boolean; note?: string },
): Promise<LessonReviewSettingType> => {
  const response = await patch<LessonReviewSettingType>(
    `/api/review-space/lessons/${lessonId}`,
    data,
  );

  if (response.status === 200) {
    return response.payload as LessonReviewSettingType;
  }

  const errorMessage =
    typeof response.payload === "object" &&
    response.payload !== null &&
    "message" in response.payload &&
    typeof response.payload.message === "string"
      ? response.payload.message
      : "Failed to update lesson review setting";

  throw new Error(errorMessage);
};
