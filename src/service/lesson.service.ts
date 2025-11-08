import { post, get } from "@/lib/request";
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

type GetLessonsByChapterIdResponse = {
  message: string;
  data: {
    items: Array<{
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
    }>;
  };
};

export const getLessonsByChapterId = async (
  chapterId: string
): Promise<GetLessonsByChapterIdResponse["data"]["items"]> => {
  const response = await get<GetLessonsByChapterIdResponse>(
    `/api/lesson/teacher-area/chapter/${chapterId}`,
    undefined
  );

  if (response.status === 200) {
    return (response.payload as GetLessonsByChapterIdResponse).data.items;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to get lessons"
    );
  }
};

