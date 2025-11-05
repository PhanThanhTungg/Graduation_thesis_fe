import { post } from "@/lib/request";
import { CreateCourseBodySchema } from "@/schema/course.schema";
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
    isPublished: data.isPublished || false,
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

