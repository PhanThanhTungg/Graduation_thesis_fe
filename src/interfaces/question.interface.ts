import { TypeQuestion, Difficulty, Model } from "@/enums/question.enum";

export interface QuestionOption {
  name: string;
  text: string;
}

export interface GeneratedQuestion {
  id: string;
  type: TypeQuestion;
  statement: string;
  options: QuestionOption[];
  aiExplanation?: string;
}

export interface GenerateQuestionsParams {
  typeQuestion: TypeQuestion;
  difficulty: Difficulty;
  model?: Model;
}
