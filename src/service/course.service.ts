import { get, patch, post } from "@/lib/request";
import { CreateCourseBodySchema, CourseType, ExtendedCourseType } from "@/schema/course.schema";
import { ChapterTreeItemType } from "@/schema/chapter.schema";
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

type GetCourseByIdResponse = {
  message: string;
  data: ExtendedCourseType;
};

export const getCourseById = async (
  id: string
): Promise<ExtendedCourseType> => {
  const response = await get<GetCourseByIdResponse>(
    `/api/course/teacher-area/${id}`
  );

  if (response.status === 200) {
    const course = (response.payload as GetCourseByIdResponse).data;
    return {
      ...course,
      courseDescription: {
        headline: course.courseDescription?.headline,
        targetKnowledges: course.courseDescription?.targetKnowledges || [],
        requirements: course.courseDescription?.requirement || [],
        suitableParticipants: course.courseDescription?.suitableParticipant || [],
        detail: course.courseDescription?.detail,
      },
    };
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to get course"
    );
  }
};

type UpdateCourseRequest = {
  title?: string;
  thumbnailUrl?: string;
  price?: number;
  categoryId?: string;
  isPublished?: boolean;
  courseDescription?: {
    headline?: string;
    targetKnowledges?: string[];
    requirement?: string[];
    suitableParticipant?: string[];
    detail?: string;
  };
};

type UpdateCourseResponse = {
  message: string;
  data: ExtendedCourseType;
};

export const updateCourseById = async (
  id: string,
  data: {
    title?: string;
    thumbnailUrl?: string;
    price?: number;
    categoryId?: string;
    isPublished?: boolean;
    courseDescription?: {
      headline?: string;
      targetKnowledges?: string[];
      requirements?: string[];
      suitableParticipants?: string[];
      detail?: string;
    };
  }
): Promise<ExtendedCourseType> => {
  const requestData: UpdateCourseRequest = {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.thumbnailUrl !== undefined && { thumbnailUrl: data.thumbnailUrl }),
    ...(data.price !== undefined && { price: data.price }),
    ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
    ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
    ...(data.courseDescription && {
      courseDescription: {
        ...(data.courseDescription.headline !== undefined && {
          headline: data.courseDescription.headline,
        }),
        ...(data.courseDescription.targetKnowledges !== undefined && {
          targetKnowledges: data.courseDescription.targetKnowledges,
        }),
        ...(data.courseDescription.requirements !== undefined && {
          requirement: data.courseDescription.requirements,
        }),
        ...(data.courseDescription.suitableParticipants !== undefined && {
          suitableParticipant: data.courseDescription.suitableParticipants,
        }),
        ...(data.courseDescription.detail !== undefined && {
          detail: data.courseDescription.detail,
        }),
      },
    }),
  };

  const response = await patch<UpdateCourseResponse>(
    `/api/course/teacher-area/${id}`,
    requestData
  );

  if (response.status === 200) {
    const course = (response.payload as UpdateCourseResponse).data;
    return {
      ...course,
      courseDescription: {
        headline: course.courseDescription?.headline,
        targetKnowledges: course.courseDescription?.targetKnowledges || [],
        requirements: course.courseDescription?.requirement || [],
        suitableParticipants: course.courseDescription?.suitableParticipant || [],
        detail: course.courseDescription?.detail,
      },
    };
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        :       "Failed to update course"
    );
  }
};

type GetChapterTreeByIdResponse = {
  message: string;
  data: {
    items: ChapterTreeItemType[];
  };
};

export const getChapterTreeById = async (
  id: string
): Promise<ChapterTreeItemType[]> => {
  const response = await get<GetChapterTreeByIdResponse>(
    `/api/course/teacher-area/${id}/chapters`
  );

  if (response.status === 200) {
    return (response.payload as GetChapterTreeByIdResponse).data.items;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to get chapter tree"
    );
  }
};

type CreateChapterByIdResponse = {
  message: string;
  data: {
    id: string;
    title: string;
    description?: string | null;
    position: number;
    parentId?: string | null;
  };
};

export const createChapterById = async (
  id: string,
  data: {
    title: string;
    description?: string;
    parentId?: string;
  }
): Promise<CreateChapterByIdResponse["data"]> => {
  const response = await post<CreateChapterByIdResponse>(
    `/api/course/teacher-area/${id}/chapters`,
    data
  );

  if (response.status === 200 || response.status === 201) {
    return (response.payload as CreateChapterByIdResponse).data;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to create chapter"
    );
  }
};

