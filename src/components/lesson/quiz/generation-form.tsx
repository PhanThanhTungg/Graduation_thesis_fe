"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  generateQuestions,
  TypeQuestion,
  Difficulty,
  Model,
  QUESTION_TYPE_LABELS,
  DIFFICULTY_LABELS,
  type GeneratedQuestion,
} from "@/service/question.service";
import { showToast } from "@/lib/toast";
import { FormSelect } from "./form-select";
import { QuestionHistoryModal } from "./question-history-modal";

interface GenerationFormProps {
  lessonSlug?: string;
  onGenerate: (questions: GeneratedQuestion[]) => void;
  hasUnanswered?: boolean;
}

export function GenerationForm({
  lessonSlug,
  onGenerate,
  hasUnanswered = false,
}: GenerationFormProps) {
  const [questionType, setQuestionType] = useState<TypeQuestion>(
    TypeQuestion.SINGLE_CHOICE,
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [model, setModel] = useState<Model>(Model.GROQ);
  const [isGenerating, setIsGenerating] = useState(false);

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
      onGenerate(questions);
      showToast("success", "Question generated successfully");
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to generate question",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-4">
          <QuestionHistoryModal lessonSlug={lessonSlug} />
        </div>
        <Card className="p-8">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange/10 mb-4">
              <Sparkles className="w-8 h-8 text-orange" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Generate Quiz Questions</h2>
            <p className="text-muted-foreground">
              Use AI to generate personalized quiz questions for this lesson
            </p>
          </div>

          <div className="space-y-6">
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

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !lessonSlug || hasUnanswered}
              className="w-full bg-orange hover:bg-orange/90"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Question
                </>
              )}
            </Button>

            {hasUnanswered && (
              <p className="text-sm text-orange text-center font-medium">
                ⚠️ You have unanswered questions. Please answer them before
                generating new ones.
              </p>
            )}

            {!lessonSlug && (
              <p className="text-sm text-destructive text-center">
                Lesson slug is required to generate questions
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
