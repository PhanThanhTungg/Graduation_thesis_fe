export enum TypeQuestion {
  SINGLE_CHOICE = "single_choice",
  MULTIPLE_CHOICE = "multiple_choice",
  FILL_IN_THE_BLANK = "fill_in_the_blank",
  SHORT_ANSWER = "short_answer",
  TRUE_FALSE = "true_false",
}

export enum Difficulty {
  VERY_EASY = "very_easy",
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
  VERY_HARD = "very_hard",
}

export enum Model {
  GROQ = "groq",
  GEMINI = "gemini",
}

// Labels for UI display
export const QUESTION_TYPE_LABELS: Record<TypeQuestion, string> = {
  [TypeQuestion.SINGLE_CHOICE]: "Single Choice",
  [TypeQuestion.MULTIPLE_CHOICE]: "Multiple Choice",
  [TypeQuestion.FILL_IN_THE_BLANK]: "Fill in the Blank",
  [TypeQuestion.SHORT_ANSWER]: "Short Answer",
  [TypeQuestion.TRUE_FALSE]: "True/False",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  [Difficulty.VERY_EASY]: "Very Easy",
  [Difficulty.EASY]: "Easy",
  [Difficulty.MEDIUM]: "Medium",
  [Difficulty.HARD]: "Hard",
  [Difficulty.VERY_HARD]: "Very Hard",
};
