import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnswerResult } from "@/service/question.service";

interface QuizResultCardProps {
  result: AnswerResult;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

const getScoreBgColor = (score: number) => {
  if (score >= 80)
    return "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700";
  if (score >= 50)
    return "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700";
  return "bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700";
};

export function QuizResultCard({ result }: QuizResultCardProps) {
  const isPassing = result.score >= 50;

  return (
    <Card className={cn("p-6 mt-6 border-2", getScoreBgColor(result.score))}>
      <div className="space-y-4">
        {/* Score Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            {isPassing ? (
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            )}
            <div>
              <h3 className="font-semibold text-lg">Result</h3>
              <p className="text-sm text-muted-foreground">
                Your answer: {result.answer}
              </p>
            </div>
          </div>
          <div
            className={cn("text-2xl font-bold", getScoreColor(result.score))}
          >
            Score: {result.score}
          </div>
        </div>

        {/* Explanation */}
        {result.explain && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange" />
              Explanation
            </h4>
            <p className="text-muted-foreground bg-white/50 dark:bg-white/5 p-3 rounded-lg">
              {result.explain}
            </p>
          </div>
        )}

        {/* AI Feedback */}
        {result.aiFeedback && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              AI Feedback
            </h4>
            <p className="text-muted-foreground bg-white/50 dark:bg-white/5 p-3 rounded-lg">
              {result.aiFeedback}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
