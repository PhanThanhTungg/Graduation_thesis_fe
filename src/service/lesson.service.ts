import { post, get, patch, del } from "@/lib/request";
import { CreateLessonBodySchema } from "@/schema/lesson.schema";
import { z } from "zod";

type CreateLessonBody = z.infer<typeof CreateLessonBodySchema>;

interface CreateLessonRequest {
  title: string;
  description?: string;
  videoId?: string;
  embedUrl?: string;
  duration?: number;
  files?: {
    fileUrl: string;
    fileName: string;
    fileSize: number;
  }[];
  isFree?: boolean;
}


type CreateLessonResponse = {
  message: string;
  data: {
    id: string;
    title: string;
    description?: string | null;
    position: number;
    duration?: number | null;
    slug: string;
    chapterId: string;
  };
};

export const createLesson = async (
  chapterId: string,
  data: CreateLessonBody
): Promise<CreateLessonResponse["data"]> => {
  const requestData: CreateLessonRequest = {
    title: data.title,
  };

  if (data.content) {
    requestData.description = data.content;
  }

  if (data.videoId && typeof data.videoId === "string") {
    requestData.videoId = data.videoId;
  }
  if (data.embedUrl) {
    if (typeof data.embedUrl === "string") {
      requestData.embedUrl = data.embedUrl;
    }
  }
  if (data.duration !== undefined && typeof data.duration === "number") {
    requestData.duration = data.duration;
  }
  if (data.files && Array.isArray(data.files) && data.files.length > 0) {
    requestData.files = data.files;
  }
  if (data.isPreview !== undefined) {
    requestData.isFree = data.isPreview;
  }

  const response = await post<CreateLessonResponse>(
    `/api/lesson/teacher-area/chapter/${chapterId}`,
    requestData as unknown as Record<string, unknown>
  );

  if (response.status === 200 || response.status === 201) {
    return (response.payload as CreateLessonResponse).data;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to create lesson"
    );
  }
};

type LessonItem = {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  duration?: number | null;
  slug: string;
  chapterId: string;
  createdAt: string;
  updatedAt?: string | null;
  videoLesson?: {
    id: string;
    videoId: string;
    embedUrl: string;
  } | null;
  files?: {
    id: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
  }[];
};

type GetLessonsByChapterIdResponse = {
  message: string;
  data: {
    items: LessonItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

type GetLessonsParams = {
  keySearch?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export const getLessonsByChapterId = async (
  chapterId: string,
  params?: GetLessonsParams
): Promise<GetLessonsByChapterIdResponse["data"]> => {
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

  const response = await get<GetLessonsByChapterIdResponse>(
    `/api/lesson/teacher-area/chapter/${chapterId}`,
    Object.keys(queryParams).length > 0 ? queryParams : undefined
  );

  if (response.status === 200) {
    return (response.payload as GetLessonsByChapterIdResponse).data;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to get lessons"
    );
  }
};

type UpdateLessonRequest = {
  title?: string;
  description?: string;
  videoId?: string;
  embedUrl?: string;
  duration?: number;
  isFree?: boolean;
};

type UpdateLessonResponse = {
  message: string;
  data: LessonItem;
};

export const updateLesson = async (
  lessonId: string,
  data: CreateLessonBody
): Promise<UpdateLessonResponse["data"]> => {
  const requestData: UpdateLessonRequest = {};

  if (data.title !== undefined) {
    requestData.title = data.title;
  }

  if (data.content !== undefined) {
    requestData.description = data.content;
  }

  if (data.videoId && typeof data.videoId === "string") {
    requestData.videoId = data.videoId;
  }
  if (data.embedUrl) {
    if (typeof data.embedUrl === "string") {
      requestData.embedUrl = data.embedUrl;
    }
  }
  if (data.duration !== undefined && typeof data.duration === "number") {
    requestData.duration = data.duration;
  }
  if (data.isPreview !== undefined) {
    requestData.isFree = data.isPreview;
  }

  const response = await patch<UpdateLessonResponse>(
    `/api/lesson/teacher-area/${lessonId}`,
    requestData
  );

  if (response.status === 200) {
    return (response.payload as UpdateLessonResponse).data;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to update lesson"
    );
  }
};

type DeleteLessonResponse = {
  message: string;
};

export const deleteLesson = async (
  lessonId: string
): Promise<void> => {
  const response = await del<DeleteLessonResponse>(
    `/api/lesson/teacher-area/${lessonId}`
  );

  if (response.status === 200) {
    return;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to delete lesson"
    );
  }
};

type GetLessonBySlugResponse = {
  message: string;
  data: LessonItem & {
    files?: {
      id: string;
      fileUrl: string;
      fileName: string;
      fileSize: number;
    }[];
    chapter: {
      id: string;
      title: string;
      slug: string;
      course: {
        id: string;
        teacherId: string;
      };
    };
  };
};

export const getLessonBySlug = async (
  lessonSlug: string
): Promise<GetLessonBySlugResponse["data"]> => {
  const response = await get<GetLessonBySlugResponse>(
    `/api/lesson/teacher-area/${lessonSlug}`, 
    undefined,  
  );

  if (response.status === 200) {
    return (response.payload as GetLessonBySlugResponse).data;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to get lesson"
    );
  }
};

