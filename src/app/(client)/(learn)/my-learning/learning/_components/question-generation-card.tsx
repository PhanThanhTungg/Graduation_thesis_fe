"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import {
  generateQuestions,
  TypeQuestion,
  Difficulty,
  Model,
  QUESTION_TYPE_LABELS,
  DIFFICULTY_LABELS,
  type GeneratedQuestion,
  getUnansweredQuestion,
} from "@/service/question.service";
import { showToast } from "@/lib/toast";
import { FormSelect } from "@/components/lesson/quiz/form-select";
import { QuestionDisplay } from "@/components/lesson/quiz/question-display";
import { CourseQuestionHistoryModal } from "./course-question-history-modal";

interface QuestionGenerationCardProps {
  lessonSlug: string;
  courseSlug: string;
  lessons: { slug: string; title: string; chapterTitle: string }[];
}

export function QuestionGenerationCard({
  lessonSlug,
  courseSlug,
  lessons,
}: QuestionGenerationCardProps) {
  const [questionType, setQuestionType] = useState<TypeQuestion>(
    TypeQuestion.SINGLE_CHOICE,
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [model, setModel] = useState<Model>(Model.GROQ);
  const [isGenerating, setIsGenerating] = useState(false);
  const [question, setQuestion] = useState<GeneratedQuestion | null>(null);
  const [isCheckingUnanswered, setIsCheckingUnanswered] = useState(true);

  const resetQuestion = () => {
    setQuestion(null);
  };

  useEffect(() => {
    let active = true;
    const fetchUnanswered = async () => {
      if (!lessonSlug) {
        setIsCheckingUnanswered(false);
        return;
      }
      try {
        const unanswered = await getUnansweredQuestion(lessonSlug);
        if (!active) return;
        if (unanswered) {
          setQuestion(unanswered);
        }
      } finally {
        if (active) {
          setIsCheckingUnanswered(false);
        }
      }
    };
    fetchUnanswered();
    return () => {
      active = false;
    };
  }, [lessonSlug]);

  const handleGenerate = async () => {
    if (!lessonSlug) {
      showToast("error", "Lesson slug is required");
      return;
    }

    try {
      setIsGenerating(true);
      const questions = await generateQuestions(lessonSlug, {
        typeQuestion: questionType,
        difficulty,
        model,
      });
      setQuestion(questions?.[0] || null);
      showToast("success", "Question generated successfully");
    } catch (error) {
      let handled = false;
      const message = error instanceof Error ? error.message.toLowerCase() : "";
      const isUnansweredError =
        typeof message === "string" &&
        message.includes("unanswered") &&
        message.includes("question");
      try {
        const unanswered = await getUnansweredQuestion(lessonSlug);
        if (unanswered) {
          setQuestion(unanswered);
          handled = true;
        }
      } catch {
        /* ignore */
      }
      if (!handled && !isUnansweredError) {
        showToast(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to generate question",
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (isCheckingUnanswered) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Question Generation</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading question...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (question) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Question Generation</CardTitle>
            <div className="flex items-center gap-2">
              <CourseQuestionHistoryModal
                courseSlug={courseSlug}
                lessons={lessons}
              />
              <Button variant="outline" size="sm" onClick={resetQuestion}>
                Generate New
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <QuestionDisplay
            question={question}
            onReset={resetQuestion}
            lessonSlug={lessonSlug}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="mb-[-20px]">
        <div className="flex items-center justify-between">
          <CardTitle>Question Generation</CardTitle>
          <CourseQuestionHistoryModal
            courseSlug={courseSlug}
            lessons={lessons}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange/10">
              <Sparkles className="w-5 h-5 text-orange" />
            </div>
            <p className="text-sm text-muted-foreground">
              Use AI to generate personalized quiz questions for this lesson
            </p>
          </div>

          <div className="flex flex-row gap-6">
            <FormSelect
              label="Question Type"
              value={questionType}
              onChange={(v) => setQuestionType(v as TypeQuestion)}
              options={Object.values(TypeQuestion).map((type) => ({
                value: type,
                label: QUESTION_TYPE_LABELS[type],
              }))}
            />

            <FormSelect
              label="Difficulty Level"
              value={difficulty}
              onChange={(v) => setDifficulty(v as Difficulty)}
              options={Object.values(Difficulty).map((level) => ({
                value: level,
                label: DIFFICULTY_LABELS[level],
              }))}
            />

            <FormSelect
              label="AI Model"
              value={model}
              onChange={(v) => setModel(v as Model)}
              options={[
                { value: Model.GROQ, label: "Groq (Faster)" },
                { value: Model.GEMINI, label: "Gemini (More Accurate)" },
              ]}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={
              isGenerating || !lessonSlug || isCheckingUnanswered || !!question
            }
            className="w-full bg-orange hover:bg-orange/90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Question
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
