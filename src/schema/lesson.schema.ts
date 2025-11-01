import { z } from "zod";

export const LessonItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  duration: z.string(),
  type: z.enum(["video", "quiz", "assignment", "reading"]),
  isPreview: z.boolean().default(false),
  isCompleted: z.boolean().default(false),
  videoUrl: z.url().optional(),
  content: z.string().optional(),
}).strip();

export type LessonItemType = z.infer<typeof LessonItemSchema>;

export const SectionSchema = z.object({
  id: z.number(),
  title: z.string(),
  lessons: z.array(LessonItemSchema),
}).strip();

export type SectionType = z.infer<typeof SectionSchema>;

export const CourseCurriculumSchema = z.object({
  courseId: z.number(),
  sections: z.array(SectionSchema),
  totalDuration: z.string(),
  totalLessons: z.number(),
}).strip();

export type CourseCurriculumType = z.infer<typeof CourseCurriculumSchema>;
