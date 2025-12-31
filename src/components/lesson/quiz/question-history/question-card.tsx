import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import type { QuestionHistoryItem } from "@/service/question.service";
import {
  QUESTION_TYPE_LABELS,
  DIFFICULTY_LABELS,
} from "@/service/question.service";
import { formatDate, parseStatement, getScoreStatus } from "./helpers";

interface QuestionCardProps {
  item: QuestionHistoryItem;
  isExpanded: boolean;
  onToggle: () => void;
}

export function QuestionCard({
  item,
  isExpanded,
  onToggle,
}: QuestionCardProps) {
  const status = getScoreStatus(item);
  const StatusIcon = status.icon;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card transition-all cursor-pointer",
        isExpanded
          ? "ring-2 ring-orange/20 border-orange/50"
          : "hover:bg-accent/50",
      )}
      onClick={onToggle}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-medium line-clamp-2">
              {parseStatement(item.statement)}
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <span className="px-2 py-0.5 rounded-full bg-orange/10 text-orange text-xs">
                {QUESTION_TYPE_LABELS[item.type]}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs">
                {DIFFICULTY_LABELS[item.difficulty]}
              </span>
              <span className="text-xs">{formatDate(item.createdAt)}</span>
            </div>
            {item.answer && (
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium">Your answer:</span> {item.answer}
              </p>
            )}
          </div>
          <div className={cn("flex items-center gap-1", status.color)}>
            <StatusIcon className="w-5 h-5" />
            <span className="font-semibold">{status.label}</span>
          </div>
        </div>
      </div>

      {isExpanded && (item.explain || item.aiFeedback) && (
        <div className="px-4 pb-4 pt-0 space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="h-px bg-border my-2" />

          {item.explain && (
            <div className="space-y-1.5">
              <h4 className="text-sm font-medium flex items-center gap-2 text-orange">
                <Sparkles className="w-3.5 h-3.5" />
                Explanation
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                {item.explain}
              </p>
            </div>
          )}

          {item.aiFeedback && (
            <div className="space-y-1.5">
              <h4 className="text-sm font-medium flex items-center gap-2 text-blue-500">
                <Sparkles className="w-3.5 h-3.5" />
                AI Feedback
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                {item.aiFeedback}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
