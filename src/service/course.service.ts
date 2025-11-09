import { get, patch, post, del } from "@/lib/request";
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

type GetMyCoursesRawResponse = {
  message: string;
  data: {
    items: Array<{
      id: number;
      title: string;
      thumbnailUrl?: string;
      price: number;
      teacher: {
        id: string;
        fullName: string;
      };
      courseDescription: {
        headline: string | null;
        targetKnowledges: string | null;
        requirement: string | null;
        suitableParticipant: string | null;
        detail: string | null;
      } | null;
      category: {
        id: string;
        title: string;
        slug: string | null;
      };
      rating: number;
      slug: string;
      isPublished: boolean;
      createdAt: string;
      updatedAt: string;
      countStudent: number;
    }>;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

type GetMyCoursesParams = {
  keySearch?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  isPublished?: boolean;
};

export const getMyCourses = async (
  params?: GetMyCoursesParams
): Promise<{ courses: ExtendedCourseType[]; pagination?: { page: number; limit: number; total: number; totalPages: number } }> => {
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
  if (params?.isPublished !== undefined) {
    queryParams.isPublished = params.isPublished.toString();
  }

  const response = await get<GetMyCoursesRawResponse>(
    "/api/course/teacher-area/my-courses",
    Object.keys(queryParams).length > 0 ? queryParams : undefined
  );

  if (response.status === 200) {
    const payload = response.payload as GetMyCoursesRawResponse;
    const courses = payload.data.items.map((course) => {
      const courseDescription = course.courseDescription
        ? {
            headline: course.courseDescription.headline || undefined,
            targetKnowledges: course.courseDescription.targetKnowledges
              ? course.courseDescription.targetKnowledges.split("&&&").filter((item) => item.trim() !== "")
              : undefined,
            requirements: course.courseDescription.requirement
              ? course.courseDescription.requirement.split("&&&").filter((item) => item.trim() !== "")
              : undefined,
            suitableParticipants: course.courseDescription.suitableParticipant
              ? course.courseDescription.suitableParticipant.split("&&&").filter((item) => item.trim() !== "")
              : undefined,
            detail: course.courseDescription.detail || undefined,
          }
        : {
            headline: undefined,
            targetKnowledges: undefined,
            requirements: undefined,
            suitableParticipants: undefined,
            detail: undefined,
          };

      return {
        id: course.id,
        title: course.title,
        courseDescription,
        thumbnailUrl: course.thumbnailUrl,
        price: course.price,
        teacher: {
          id: course.teacher.id,
          fullName: course.teacher.fullName,
          email: "",
          role: "teacher" as const,
          emailVerified: false,
          avatarUrl: null,
          status: "active" as const,
          country: "Vietnam" as const,
        },
        rating: course.rating,
        slug: course.slug,
        isPublished: course.isPublished,
        createdAt: course.createdAt ? new Date(course.createdAt) : undefined,
        updatedAt: new Date(course.updatedAt),
        countStudent: course.countStudent,
        category: {
          id: course.category.id,
          title: course.category.title,
          slug: course.category.slug || "",
          parentId: null,
        },
      };
    });
    
    return {
      courses,
      pagination: payload.data.pagination,
    };
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

type GetCourseBySlugResponse = {
  message: string;
  data: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
    price: number;
    slug: string;
    isPublished: boolean;
    countStudent: number;
    createdAt: string;
    updatedAt: string | null;
    teacher: {
      id: string;
      fullName: string;
      email: string;
      avatarUrl: string | null;
      role: string;
      emailVerified: boolean;
      status: string;
      country: string;
    };
    courseDescription: {
      headline: string | null;
      targetKnowledges: string[];
      requirement: string[];
      suitableParticipant: string[];
      detail: string | null;
    } | null;
    category: {
      id: string;
      title: string | null;
      slug: string | null;
    };
  };
};

export const getCourseBySlug = async (
  slug: string
): Promise<ExtendedCourseType> => {
  const response = await get<GetCourseBySlugResponse>(
    `/api/course/${slug}`,
    undefined
  );

  if (response.status === 200) {
    const course = (response.payload as GetCourseBySlugResponse).data;
    const courseDescription = course.courseDescription
      ? {
          headline: course.courseDescription.headline || undefined,
          targetKnowledges: course.courseDescription.targetKnowledges || undefined,
          requirements: course.courseDescription.requirement || undefined,
          suitableParticipants: course.courseDescription.suitableParticipant || undefined,
          detail: course.courseDescription.detail || undefined,
        }
      : {
          headline: undefined,
          targetKnowledges: undefined,
          requirements: undefined,
          suitableParticipants: undefined,
          detail: undefined,
        };

    return {
      id: 1,
      title: course.title,
      courseDescription,
      thumbnailUrl: course.thumbnailUrl || undefined,
      price: course.price,
      teacher: {
        id: course.teacher.id,
        fullName: course.teacher.fullName,
        email: course.teacher.email,
        role: course.teacher.role as "teacher" | "student",
        emailVerified: course.teacher.emailVerified,
        avatarUrl: course.teacher.avatarUrl,
        status: course.teacher.status as "active" | "inactive" | "banned",
        country: course.teacher.country as any,
      },
      rating: 5.0,
      slug: course.slug,
      isPublished: course.isPublished,
      updatedAt: course.updatedAt ? new Date(course.updatedAt) : new Date(),
      countStudent: course.countStudent,
      category: course.category
        ? {
            id: course.category.id,
            parentId: null,
            title: course.category.title || "",
            slug: course.category.slug || "",
          }
        : {
            id: "",
            parentId: null,
            title: "",
            slug: "",
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

type GetCourseByIdRawResponse = {
  message: string;
  data: Omit<ExtendedCourseType, 'courseDescription'> & {
    courseDescription?: {
      headline?: string;
      targetKnowledges?: string[];
      requirement?: string[];
      suitableParticipant?: string[];
      detail?: string;
    };
  };
};

type GetCourseByIdResponse = {
  message: string;
  data: ExtendedCourseType;
};

export const getCourseBySlugTeacherArea = async (
  slug: string
): Promise<ExtendedCourseType> => {
  const response = await get<GetCourseByIdRawResponse>(
    `/api/course/teacher-area/slug/${slug}`,
    {}
  );

  if (response.status === 200) {
    const course = (response.payload as GetCourseByIdRawResponse).data;
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

export const getCourseById = async (
  id: string
): Promise<ExtendedCourseType> => {
  const response = await get<GetCourseByIdRawResponse>(
    `/api/course/teacher-area/${id}`,
    {}
  );

  if (response.status === 200) {
    const course = (response.payload as GetCourseByIdRawResponse).data;
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

type UpdateCourseRawResponse = {
  message: string;
  data: {
    id: number;
    title: string;
    thumbnailUrl?: string;
    price: number;
    teacher: {
      id: string;
      fullName: string;
    };
    courseDescription: {
      headline: string | null;
      targetKnowledges: string[];
      requirement: string[];
      suitableParticipant: string[];
      detail: string | null;
    } | null;
    category: {
      id: string;
      title: string;
      slug: string | null;
    };
    rating: number;
    slug: string;
    isPublished: boolean;
    updatedAt: string;
    countStudent: number;
  };
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

  const response = await patch<UpdateCourseRawResponse>(
    `/api/course/teacher-area/${id}`,
    requestData
  );

  if (response.status === 200) {
    const course = (response.payload as UpdateCourseRawResponse).data;
    return {
      id: course.id,
      title: course.title,
      courseDescription: course.courseDescription
        ? {
            headline: course.courseDescription.headline || undefined,
            targetKnowledges: course.courseDescription.targetKnowledges || [],
            requirements: course.courseDescription.requirement || [],
            suitableParticipants: course.courseDescription.suitableParticipant || [],
            detail: course.courseDescription.detail || undefined,
          }
        : {
            headline: undefined,
            targetKnowledges: undefined,
            requirements: undefined,
            suitableParticipants: undefined,
            detail: undefined,
          },
      thumbnailUrl: course.thumbnailUrl,
      price: course.price,
      teacher: {
        id: course.teacher.id,
        fullName: course.teacher.fullName,
        email: "",
        role: "teacher" as const,
        emailVerified: false,
        avatarUrl: null,
        status: "active" as const,
        country: "Vietnam" as const,
      },
      rating: course.rating,
      slug: course.slug,
      isPublished: course.isPublished,
      updatedAt: new Date(course.updatedAt),
      countStudent: course.countStudent,
      category: {
        id: course.category.id,
        title: course.category.title,
        slug: course.category.slug || "",
        parentId: null,
      },
    };
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to update course"
    );
  }
};

type GetChapterTreeByIdResponse = {
  message: string;
  data: {
    items: ChapterTreeItemType[];
  };
};

export const getChapterTreeBySlug = async (
  slug: string
): Promise<ChapterTreeItemType[]> => {
  const response = await get<GetChapterTreeByIdResponse>(
    `/api/course/teacher-area/slug/${slug}/chapters`,
    {}
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

export const getChapterTreeById = async (
  id: string
): Promise<ChapterTreeItemType[]> => {
  const response = await get<GetChapterTreeByIdResponse>(
    `/api/course/teacher-area/${id}/chapters`,
    {}
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

export const createChapterBySlug = async (
  slug: string,
  data: {
    title: string;
    description?: string;
    parentId?: string;
  }
): Promise<CreateChapterByIdResponse["data"]> => {
  const response = await post<CreateChapterByIdResponse>(
    `/api/course/teacher-area/slug/${slug}/chapters`,
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

type GetAllCoursesResponse = {
  message: string;
  data: {
    items: Array<{
      id: string;
      title: string;
      thumbnailUrl: string | null;
      price: number;
      slug: string;
      isPublished: boolean;
      countStudent: number;
      createdAt: string;
      updatedAt: string | null;
      teacher: {
        id: string;
        fullName: string;
      };
      courseDescription: {
        id: string;
        headline: string | null;
        targetKnowledges: string | null;
        requirement: string | null;
        suitableParticipant: string | null;
        detail: string | null;
      } | null;
      category: {
        id: string;
        title: string | null;
        slug: string | null;
      };
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

type GetAllCoursesParams = {
  keySearch?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export const getAllCourses = async (
  params?: GetAllCoursesParams
): Promise<{ courses: CourseType[]; pagination: GetAllCoursesResponse["data"]["pagination"] }> => {
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

  const response = await get<GetAllCoursesResponse>(
    "/api/course",
    Object.keys(queryParams).length > 0 ? queryParams : undefined
  );

  if (response.status === 200) {
    const payload = response.payload as GetAllCoursesResponse;
    const courses: CourseType[] = payload.data.items.map((course, index) => {
      const courseDescription = course.courseDescription
        ? {
            headline: course.courseDescription.headline || undefined,
            targetKnowledges: course.courseDescription.targetKnowledges
              ? course.courseDescription.targetKnowledges.split("&&&")
              : undefined,
            requirements: course.courseDescription.requirement
              ? course.courseDescription.requirement.split("&&&")
              : undefined,
            suitableParticipants: course.courseDescription.suitableParticipant
              ? course.courseDescription.suitableParticipant.split("&&&")
              : undefined,
            detail: course.courseDescription.detail || undefined,
          }
        : {
            headline: undefined,
            targetKnowledges: undefined,
            requirements: undefined,
            suitableParticipants: undefined,
            detail: undefined,
          };

      return {
        id: index + 1,
        title: course.title,
        courseDescription,
        thumbnailUrl: course.thumbnailUrl || undefined,
        price: course.price,
        teacher: {
          id: course.teacher.id,
          fullName: course.teacher.fullName,
          email: "",
          role: "teacher" as const,
          emailVerified: false,
          avatarUrl: null,
          status: "active" as const,
          country: "Vietnam" as const,
        },
        rating: 5.0,
        slug: course.slug,
        isPublished: course.isPublished,
        updatedAt: course.updatedAt ? new Date(course.updatedAt) : new Date(),
        countStudent: course.countStudent,
      };
    });

    return {
      courses,
      pagination: payload.data.pagination,
    };
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to get courses"
    );
  }
};

type UpdateChapterResponse = {
  message: string;
  data: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    position: number;
    parentId?: string | null;
  };
};

export const updateChapterBySlug = async (
  slug: string,
  chapterId: string,
  data: {
    title?: string;
    description?: string;
  }
): Promise<UpdateChapterResponse["data"]> => {
  const response = await patch<UpdateChapterResponse>(
    `/api/course/teacher-area/slug/${slug}/chapters/${chapterId}`,
    data
  );

  if (response.status === 200) {
    return (response.payload as UpdateChapterResponse).data;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to update chapter"
    );
  }
};

export const updateChapterById = async (
  courseId: string,
  chapterId: string,
  data: {
    title?: string;
    description?: string;
  }
): Promise<UpdateChapterResponse["data"]> => {
  const response = await patch<UpdateChapterResponse>(
    `/api/course/teacher-area/${courseId}/chapters/${chapterId}`,
    data
  );

  if (response.status === 200) {
    return (response.payload as UpdateChapterResponse).data;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to update chapter"
    );
  }
};

type DeleteChapterResponse = {
  message: string;
};

export const deleteChapterBySlug = async (
  slug: string,
  chapterId: string
): Promise<void> => {
  const response = await del<DeleteChapterResponse>(
    `/api/course/teacher-area/slug/${slug}/chapters/${chapterId}`
  );

  if (response.status === 200) {
    return;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to delete chapter"
    );
  }
};

type DeleteCourseResponse = {
  message: string;
};

export const deleteCourse = async (
  courseId: string
): Promise<void> => {
  const response = await del<DeleteCourseResponse>(
    `/api/course/teacher-area/${courseId}`
  );

  if (response.status === 200) {
    return;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to delete course"
    );
  }
};

