import { Difficulty } from "@/service/question.service";

export const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export const DIFFICULTY_COLOR_MAP: Record<Difficulty, string> = {
  [Difficulty.VERY_EASY]: "bg-emerald-400",
  [Difficulty.EASY]: "bg-green-500",
  [Difficulty.MEDIUM]: "bg-yellow-500",
  [Difficulty.HARD]: "bg-orange-500",
  [Difficulty.VERY_HARD]: "bg-red-600",
};

export const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest First", icon: "arrow-down" },
  { value: "date-asc", label: "Oldest First", icon: "arrow-up" },
  { value: "score-desc", label: "Highest Score", icon: "check" },
  { value: "score-asc", label: "Lowest Score", icon: "x" },
] as const;
