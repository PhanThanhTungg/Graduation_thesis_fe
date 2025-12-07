import { post } from "@/lib/request";
import { Model } from "@/enums/question.enum";
import {
  GeneratedQuestion,
  GenerateQuestionsParams,
  AnswerQuestionParams,
  AnswerResult,
} from "@/interfaces/question.interface";
import JsonUtils, { BackendQuestion } from "@/utils/json.util";

// Re-export for convenience
export * from "@/enums/question.enum";
export * from "@/interfaces/question.interface";

// API function
export const generateQuestions = async (
  lessonSlug: string,
  params: GenerateQuestionsParams,
): Promise<GeneratedQuestion[]> => {
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

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to generate questions",
  );
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
