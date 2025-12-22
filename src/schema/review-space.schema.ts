import { z } from "zod";

export const LessonReviewStatusEnum = z.enum([
  "new",
  "learning",
  "reviewing",
  "lapsed",
  "suspending",
]);

export const DifficultyEnum = z.enum(["very_easy", "easy", "medium", "hard"]);

export const TypeQuestionEnum = z.enum([
  "single_choice",
  "multiple_choice",
  "fill_in_the_blank",
  "short_answer",
  "true_false",
]);

export const LessonReviewSettingSchema = z.object({
  id: z.string(),
  reviewEnabled: z.boolean(),
  easinessFactor: z.number(),
  intervalDays: z.number(),
  status: LessonReviewStatusEnum,
  reviewStep: z.number(),
  lapsed: z.number(),
  lastReviewedAt: z.union([z.string(), z.date()]).nullable(),
  note: z.string().nullable(),
  difficulty: DifficultyEnum,
  typeQues: TypeQuestionEnum,
  userId: z.string(),
  lessonId: z.string(),
  lessonTitle: z.string(),
  courseTitle: z.string(),
  courseId: z.string(),
  chapterId: z.string(),
  chapterTitle: z.string(),
  courseSlug: z.string(),
  lessonSlug: z.string(),
});

export type LessonReviewSettingType = z.infer<typeof LessonReviewSettingSchema>;
export type LessonReviewStatus = z.infer<typeof LessonReviewStatusEnum>;
