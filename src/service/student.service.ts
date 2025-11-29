import { get } from "@/lib/request";
import {
  GetStudentsOfCourseResponseSchema,
  GetStudentsOfCourseResponseType,
  CourseStudentStatsSchema,
  CourseStudentStatsType,
} from "@/schema/student.schema";

interface GetStudentsParams {
  courseId: string;
  page?: number;
  limit?: number;
  search?: string;
  progressFilter?: "not_started" | "in_progress" | "completed";
}

interface GetStudentStatsParams {
  courseId: string;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

/**
 * Lấy danh sách học sinh của một khóa học
 */
export const getStudentsOfCourse = async (
  params: GetStudentsParams,
): Promise<GetStudentsOfCourseResponseType> => {
  const { courseId, page = 1, limit = 20, search, progressFilter } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(progressFilter && { progressFilter }),
  });

  const response = await get<ApiResponse<GetStudentsOfCourseResponseType>>(
    `/api/teacher/students/course/${courseId}?${queryParams.toString()}`,
    undefined,
    {
      baseUrl: undefined,
    },
  );

  console.log("Students response:", {
    status: response.status,
    payload: response.payload,
  });

  if (
    response.status === 200 &&
    response.payload &&
    "data" in response.payload
  ) {
    const apiResponse =
      response.payload as ApiResponse<GetStudentsOfCourseResponseType>;
    return GetStudentsOfCourseResponseSchema.parse(apiResponse.data);
  } else {
    const errorMsg =
      response.payload && "message" in response.payload
        ? (response.payload as unknown as Record<string, unknown>).message
        : JSON.stringify(response.payload);
    console.error("Failed to get students:", errorMsg);
    throw new Error(`Failed to get students: ${errorMsg}`);
  }
};

/**
 * Lấy thống kê tổng quát học sinh của một khóa học
 */
export const getCourseStudentStats = async (
  params: GetStudentStatsParams,
): Promise<CourseStudentStatsType> => {
  const { courseId } = params;

  const response = await get<ApiResponse<CourseStudentStatsType>>(
    `/api/teacher/students/course/${courseId}/stats`,
    undefined,
    {
      baseUrl: undefined,
    },
  );

  if (
    response.status === 200 &&
    response.payload &&
    "data" in response.payload
  ) {
    const apiResponse = response.payload as ApiResponse<CourseStudentStatsType>;
    return CourseStudentStatsSchema.parse(apiResponse.data);
  } else {
    const errorMsg =
      response.payload && "message" in response.payload
        ? (response.payload as unknown as Record<string, unknown>).message
        : JSON.stringify(response.payload);
    throw new Error(`Failed to get stats: ${errorMsg}`);
  }
};
