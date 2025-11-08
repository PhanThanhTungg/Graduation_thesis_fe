import { z } from "zod";

export const LessonItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  duration: z.string(),
  type: z.enum(["video", "quiz", "assignment", "reading"]),
  isPreview: z.boolean().default(false),
  isCompleted: z.boolean().default(false),
  videoId: z.string().optional(),
  embedUrl: z.union([z.url(), z.instanceof(File)]).optional(),
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
}).strip();

export type CourseCurriculumType = z.infer<typeof CourseCurriculumSchema>;

export const CreateSectionBodySchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
}).strip();

export const CreateLessonBodySchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  videoId: z.string().optional(),
  embedUrl: z.union([z.string(), z.instanceof(File)]).optional(),
  duration: z.number().optional(),
  isPreview: z.boolean().default(false).optional(),
  content: z.string().optional(),
  files: z.array(z.object({
    fileUrl: z.string(),
    fileName: z.string(),
    fileSize: z.number(),
  })).optional(),
}).strip();
