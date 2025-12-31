"use client";

import { useState, useEffect } from "react";
import {
  type GeneratedQuestion,
  getUnansweredQuestion,
} from "@/service/question.service";
import { GenerationForm, QuestionDisplay } from "./quiz";
import { Loader2 } from "lucide-react";

interface LessonQuizTabProps {
  lessonId: string;
  lessonSlug?: string;
}

export function LessonQuizTab({ lessonSlug }: LessonQuizTabProps) {
  const [question, setQuestion] = useState<GeneratedQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnanswered, setHasUnanswered] = useState(false);

  // Check for unanswered questions on mount
  useEffect(() => {
    const checkUnanswered = async () => {
      if (!lessonSlug) {
        setIsLoading(false);
        return;
      }

      try {
        const unansweredQuestion = await getUnansweredQuestion(lessonSlug);
        if (unansweredQuestion) {
          setQuestion(unansweredQuestion);
          setHasUnanswered(true);
        }
      } catch (error) {
        console.error("Failed to fetch unanswered question:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUnanswered();
  }, [lessonSlug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange" />
      </div>
    );
  }

  if (!question) {
    return (
      <GenerationForm
        lessonSlug={lessonSlug}
        onGenerate={(questions) => {
          setQuestion(questions[0] || null);
          setHasUnanswered(true);
        }}
        hasUnanswered={hasUnanswered}
      />
    );
  }

  return (
    <QuestionDisplay
      question={question}
      onReset={() => {
        setQuestion(null);
        setHasUnanswered(false);
      }}
      lessonSlug={lessonSlug}
    />
  );
}
