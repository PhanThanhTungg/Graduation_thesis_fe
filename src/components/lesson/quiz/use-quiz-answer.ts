import { useState, useCallback, useMemo } from "react";
import {
  TypeQuestion,
  type GeneratedQuestion,
  type AnswerResult,
} from "@/service/question.service";
import { answerQuestion } from "@/service/question.service";
import { showToast } from "@/lib/toast";

export function useQuizAnswer(question: GeneratedQuestion) {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AnswerResult | null>(null);

  const questionType = useMemo(
    () => ({
      isSingleChoice: question.type === TypeQuestion.SINGLE_CHOICE,
      isMultipleChoice: question.type === TypeQuestion.MULTIPLE_CHOICE,
      isTrueFalse: question.type === TypeQuestion.TRUE_FALSE,
      isTextQuestion:
        question.type === TypeQuestion.SHORT_ANSWER ||
        question.type === TypeQuestion.FILL_IN_THE_BLANK,
    }),
    [question.type],
  );

  const hasAnswered = result !== null;

  const toggleMultipleAnswer = useCallback((optName: string) => {
    setSelectedAnswers((prev) =>
      prev.includes(optName)
        ? prev.filter((a) => a !== optName)
        : [...prev, optName],
    );
  }, []);

  const getAnswer = useCallback((): string => {
    if (questionType.isTextQuestion) return textAnswer;
    if (questionType.isMultipleChoice) return selectedAnswers.join(", ");
    return selectedAnswer;
  }, [questionType, textAnswer, selectedAnswers, selectedAnswer]);

  const canSubmit = useMemo((): boolean => {
    if (isSubmitting || hasAnswered) return false;
    if (questionType.isTextQuestion) return textAnswer.trim().length > 0;
    if (questionType.isMultipleChoice) return selectedAnswers.length > 0;
    return selectedAnswer.length > 0;
  }, [
    isSubmitting,
    hasAnswered,
    questionType,
    textAnswer,
    selectedAnswers,
    selectedAnswer,
  ]);

  const handleSubmit = useCallback(async () => {
    const answer = getAnswer();
    if (!answer) {
      showToast("error", "Please provide an answer before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await answerQuestion(question.id, { answer });
      setResult(response);
      showToast("success", "Your answer has been submitted!");
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to submit answer",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [getAnswer, question.id]);

  return {
    // State
    selectedAnswer,
    selectedAnswers,
    textAnswer,
    isSubmitting,
    result,
    hasAnswered,
    canSubmit,
    questionType,
    // Actions
    setSelectedAnswer,
    toggleMultipleAnswer,
    setTextAnswer,
    handleSubmit,
  };
}
