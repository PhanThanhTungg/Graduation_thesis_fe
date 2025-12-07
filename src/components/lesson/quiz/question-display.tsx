"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Send, Loader2 } from "lucide-react";
import {
  QUESTION_TYPE_LABELS,
  type GeneratedQuestion,
} from "@/service/question.service";
import { QuizOptions } from "./quiz-options";
import { QuizResultCard } from "./quiz-result-card";
import { useQuizAnswer } from "./use-quiz-answer";
import { QuestionHistoryModal } from "./question-history-modal";

interface QuestionDisplayProps {
  question: GeneratedQuestion;
  onReset: () => void;
  lessonSlug?: string;
}

export function QuestionDisplay({
  question,
  onReset,
  lessonSlug,
}: QuestionDisplayProps) {
  const {
    selectedAnswer,
    selectedAnswers,
    textAnswer,
    isSubmitting,
    result,
    hasAnswered,
    canSubmit,
    setSelectedAnswer,
    toggleMultipleAnswer,
    setTextAnswer,
    handleSubmit,
  } = useQuizAnswer(question);

  return (
    <div className="px-6 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Generated Question</h2>
            <p className="text-muted-foreground">
              {QUESTION_TYPE_LABELS[question.type]}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <QuestionHistoryModal lessonSlug={lessonSlug} />
            <Button
              onClick={onReset}
              variant="outline"
              size="sm"
              disabled={!hasAnswered}
              title={
                !hasAnswered
                  ? "Answer the question first"
                  : "Generate a new question"
              }
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate New
            </Button>
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-6">
          <div className="mb-6">
            {/* Question Title */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange text-white flex items-center justify-center font-semibold">
                Q
              </div>
              <p className="text-lg font-semibold flex-1">
                {question.statement}
              </p>
            </div>

            {/* Options */}
            <QuizOptions
              question={question}
              selectedAnswer={selectedAnswer}
              selectedAnswers={selectedAnswers}
              textAnswer={textAnswer}
              disabled={hasAnswered}
              onSelectSingle={setSelectedAnswer}
              onToggleMultiple={toggleMultipleAnswer}
              onTextChange={setTextAnswer}
            />

            {/* Submit Button */}
            {!hasAnswered && (
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="bg-orange hover:bg-orange/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Answer
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Result Card */}
        {result && <QuizResultCard result={result} />}
      </div>
    </div>
  );
}
