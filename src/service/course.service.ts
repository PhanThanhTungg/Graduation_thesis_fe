import { get, patch, post } from "@/lib/request";
import { CreateCourseBodySchema, CourseType } from "@/schema/course.schema";
import { z } from "zod";

type CreateCourseBody = z.infer<typeof CreateCourseBodySchema>;

type CreateCourseRequest = {
  title: string;
  thumbnailUrl?: string;
  price: number;
  categoryId: string;
  isPublished?: boolean;
  courseDescription: {
    headline?: string;
    targetKnowledges?: string[];
    requirement?: string[];
    suitableParticipant?: string[];
    detail?: string;
  };
};

type CreateCourseResponse = {
  message: string;
  data: {
    createdCourse: unknown;
    courseDescriptionData: unknown;
  };
};

export const createCourse = async (
  data: CreateCourseBody
): Promise<CreateCourseResponse> => {
  const requestData: CreateCourseRequest = {
    title: data.title,
    price: data.price,
    categoryId: data.categoryId,
    isPublished: false,
    courseDescription: {
      headline: data.courseDescription?.headline,
      targetKnowledges: data.courseDescription?.targetKnowledges,
      requirement: data.courseDescription?.requirements,
      suitableParticipant: data.courseDescription?.suitableParticipants,
      detail: data.courseDescription?.detail,
    },
  };

  if (data.thumbnailUrl && typeof data.thumbnailUrl === "string") {
    requestData.thumbnailUrl = data.thumbnailUrl;
  }

  const response = await post<CreateCourseResponse>(
    "/api/course/teacher-area",
    requestData
  );

  if (response.status === 200 || response.status === 201) {
    return response.payload as CreateCourseResponse;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to create course"
    );
  }
};

type GetMyCoursesResponse = {
  message: string;
  data: {
    items: CourseType[];
  };
};

type GetMyCoursesParams = {
  keySearch?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export const getMyCourses = async (
  params?: GetMyCoursesParams
): Promise<CourseType[]> => {
  const queryParams: Record<string, string> = {};
  
  if (params?.keySearch) {
    queryParams.keySearch = params.keySearch;
  }
  if (params?.sortField) {
    queryParams.sortField = params.sortField;
  }
  if (params?.sortOrder) {
    queryParams.sortOrder = params.sortOrder;
  }
  if (params?.page) {
    queryParams.page = params.page.toString();
  }
  if (params?.limit) {
    queryParams.limit = params.limit.toString();
  }

  const response = await get<GetMyCoursesResponse>(
    "/api/course/teacher-area/my-courses",
    Object.keys(queryParams).length > 0 ? queryParams : undefined
  );

  if (response.status === 200) {
    return (response.payload as GetMyCoursesResponse).data.items;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to get courses"
    );
  }
};

type UpdateCourseStatusResponse = {
  message: string;
  data: CourseType;
};

export const updateCourseStatus = async (
  courseId: number,
  isPublished: boolean
): Promise<CourseType> => {
  const response = await patch<UpdateCourseStatusResponse>(
    `/api/course/teacher-area/${courseId}`,
    { isPublished }
  );

  if (response.status === 200) {
    return (response.payload as UpdateCourseStatusResponse).data;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to update course status"
    );
  }
};

