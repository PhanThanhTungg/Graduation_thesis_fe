import { post, get, patch, del } from "@/lib/request";
import { CreateLessonBodySchema } from "@/schema/lesson.schema";
import { z } from "zod";

type CreateLessonBody = z.infer<typeof CreateLessonBodySchema>;

type CreateLessonRequest = {
  title: string;
  description?: string;
  type: "video" | "theory" | "exercise";
  videoUrl?: string;
};

type CreateLessonResponse = {
  message: string;
  data: {
    id: string;
    title: string;
    description?: string | null;
    type: string;
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
    type: data.type,
  };

  if (data.content) {
    requestData.description = data.content;
  }

  if (data.type === "video" && data.videoUrl) {
    if (typeof data.videoUrl === "string") {
      requestData.videoUrl = data.videoUrl;
    }
  }

  const response = await post<CreateLessonResponse>(
    `/api/lesson/teacher-area/chapter/${chapterId}`,
    requestData
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
  type: string;
  position: number;
  duration?: number | null;
  slug: string;
  chapterId: string;
  videoLesson?: {
    id: string;
    videoUrl: string;
  } | null;
  theoryFile?: {
    id: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
  } | null;
  exerciseFile?: {
    id: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
  } | null;
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
  type?: "video" | "theory" | "exercise";
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
  if (params?.type) {
    queryParams.type = params.type;
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
  type?: "video" | "theory" | "exercise";
  videoUrl?: string;
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

  if (data.type !== undefined) {
    requestData.type = data.type;
  }

  if (data.type === "video" && data.videoUrl) {
    if (typeof data.videoUrl === "string") {
      requestData.videoUrl = data.videoUrl;
    }
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

