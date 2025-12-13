import { z } from "zod";

export const LessonReviewStatusEnum = z.enum([
  "new",
  "learning",
  "reviewing",
  "lapsed",
  "suspending",
]);

export const LessonReviewSettingSchema = z.object({
  id: z.string(),
  reviewEnabled: z.boolean(),
  easinessFactor: z.number(),
  intervalDays: z.number(),
  status: LessonReviewStatusEnum,
  reviewStep: z.number(),
  lapsed: z.number(),
  userId: z.string(),
  lessonId: z.string(),
  lessonTitle: z.string(),
  courseTitle: z.string(),
  courseId: z.string(),
  chapterId: z.string(),
  chapterTitle: z.string(),
});

export type LessonReviewSettingType = z.infer<typeof LessonReviewSettingSchema>;
export type LessonReviewStatus = z.infer<typeof LessonReviewStatusEnum>;
