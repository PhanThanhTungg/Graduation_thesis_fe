"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  History,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  getQuestionHistory,
  QUESTION_TYPE_LABELS,
  DIFFICULTY_LABELS,
  type QuestionHistoryItem,
} from "@/service/question.service";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface QuestionHistoryModalProps {
  lessonSlug?: string;
}

export function QuestionHistoryModal({
  lessonSlug,
}: QuestionHistoryModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<QuestionHistoryItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (open && lessonSlug) {
      setLoading(true);
      getQuestionHistory(lessonSlug)
        .then(setHistory)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open, lessonSlug]);

  const parseStatement = (statement: string) => {
    try {
      const parsed = JSON.parse(statement);
      return parsed.statement || parsed.question || statement;
    } catch {
      return statement;
    }
  };

  const getScoreStatus = (item: QuestionHistoryItem) => {
    if (item.answer === null) {
      return {
        icon: Clock,
        color: "text-muted-foreground",
        label: "Not answered",
      };
    }
    if ((item.score ?? 0) >= 50) {
      return {
        icon: CheckCircle2,
        color: "text-green-600 dark:text-green-400",
        label: `${item.score}`,
      };
    }
    return {
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      label: `${item.score}`,
    };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="w-4 h-4 mr-2" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Question History</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No question history yet</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              {history.map((item) => {
                const status = getScoreStatus(item);
                const StatusIcon = status.icon;
                const isExpanded = expandedId === item.id;

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-lg border bg-card transition-all cursor-pointer",
                      isExpanded
                        ? "ring-2 ring-orange/20 border-orange/50"
                        : "hover:bg-accent/50",
                    )}
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
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
                            <span className="text-xs">
                              {formatDate(item.createdAt)}
                            </span>
                          </div>
                          {item.answer && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              <span className="font-medium">Your answer:</span>{" "}
                              {item.answer}
                            </p>
                          )}
                        </div>
                        <div
                          className={cn(
                            "flex items-center gap-1",
                            status.color,
                          )}
                        >
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
              })}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
