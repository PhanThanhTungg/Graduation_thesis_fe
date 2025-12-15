import { get, post } from "@/lib/request";
import { Model } from "@/enums/question.enum";
import {
  GeneratedQuestion,
  GenerateQuestionsParams,
  AnswerQuestionParams,
  AnswerResult,
  QuestionHistoryItem,
} from "@/interfaces/question.interface";
import JsonUtils, { BackendQuestion } from "@/utils/json.util";
import { showToast } from "@/lib/toast";

// Re-export for convenience
export * from "@/enums/question.enum";
export * from "@/interfaces/question.interface";

// API function
export const generateQuestions = async (
  lessonSlug: string,
  params: GenerateQuestionsParams,
) => {
  const response = await post<{ message: string; data: BackendQuestion[] }>(
    `/api/question/generate-questions/${lessonSlug}`,
    {
      typeQuestion: params.typeQuestion,
      difficulty: params.difficulty,
      totalQuestion: 1,
      model: params.model || Model.GROQ,
    } as unknown as Record<string, unknown>,
  );

  if (response.status === 200 || response.status === 201) {
    return (response.payload as { data: BackendQuestion[] }).data.map(
      JsonUtils.parseQuestionFromBackend,
    );
  }
  showToast(
    "error",
    response.payload.message || "Failed to generate questions",
  );
  throw new Error(response.payload.message || "Failed to generate questions");
};

// Answer question API
export const answerQuestion = async (
  questionId: string,
  params: AnswerQuestionParams,
): Promise<AnswerResult> => {
  const response = await post<{ message: string; data: AnswerResult }>(
    `/api/question/answer-question/${questionId}`,
    {
      answer: params.answer,
      model: params.model || Model.GROQ,
    } as unknown as Record<string, unknown>,
  );

  if (response.status === 200 || response.status === 201) {
    return (response.payload as { data: AnswerResult }).data;
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to submit answer",
  );
};

// Get question history API
export interface QuestionHistoryParams {
  page?: number;
  limit?: number;
  type?: string;
  difficulty?: string;
  sortBy?: "date" | "score";
  sortOrder?: "asc" | "desc";
}

export interface QuestionHistoryResponse {
  data: QuestionHistoryItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const getQuestionHistory = async (
  lessonSlug: string,
  params?: QuestionHistoryParams,
): Promise<QuestionHistoryResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.type && params.type !== "all")
    queryParams.append("type", params.type);
  if (params?.difficulty && params.difficulty !== "all")
    queryParams.append("difficulty", params.difficulty);
  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

  const url = `/api/question/history/${lessonSlug}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  const response = await get<{
    message: string;
    data: QuestionHistoryItem[];
    pagination?: QuestionHistoryResponse["pagination"];
  }>(url, undefined);

  if (response.status === 200) {
    const payload = response.payload as {
      data: QuestionHistoryItem[];
      pagination?: QuestionHistoryResponse["pagination"];
    };

    // If backend returns pagination info, use it
    if (payload.pagination) {
      return {
        data: payload.data,
        pagination: payload.pagination,
      };
    }

    // Otherwise, return all data with default pagination
    return {
      data: payload.data,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: payload.data.length,
        itemsPerPage: payload.data.length,
      },
    };
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to get question history",
  );
};

// Get unanswered question API
export const getUnansweredQuestion = async (
  lessonSlug: string,
): Promise<GeneratedQuestion | null> => {
  const response = await get<{
    message: string;
    data: BackendQuestion | null;
  }>(`/api/question/unanswered/${lessonSlug}`, undefined);

  if (response.status === 200) {
    const payload = response.payload as {
      data: BackendQuestion | null;
    };

    if (payload.data) {
      return JsonUtils.parseQuestionFromBackend(payload.data);
    }

    return null;
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to get unanswered question",
  );
};
