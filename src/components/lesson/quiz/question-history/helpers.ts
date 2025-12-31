import { CheckCircle2, XCircle, Clock } from "lucide-react";
import type { QuestionHistoryItem } from "@/service/question.service";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const parseStatement = (statement: string) => {
  try {
    const parsed = JSON.parse(statement);
    return parsed.statement || parsed.question || statement;
  } catch {
    return statement;
  }
};

export const getScoreStatus = (item: QuestionHistoryItem) => {
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
