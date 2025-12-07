"use client";

import { useState } from "react";
import { type GeneratedQuestion } from "@/service/question.service";
import { GenerationForm, QuestionDisplay } from "./quiz";

interface LessonQuizTabProps {
  lessonId: string;
  lessonSlug?: string;
}

export function LessonQuizTab({ lessonSlug }: LessonQuizTabProps) {
  const [question, setQuestion] = useState<GeneratedQuestion | null>(null);

  if (!question) {
    return (
      <GenerationForm
        lessonSlug={lessonSlug}
        onGenerate={(questions) => setQuestion(questions[0] || null)}
      />
    );
  }

  return (
    <QuestionDisplay
      question={question}
      onReset={() => setQuestion(null)}
      lessonSlug={lessonSlug}
    />
  );
}
