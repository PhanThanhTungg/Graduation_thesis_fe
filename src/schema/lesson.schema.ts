import { z } from "zod";

export const LessonItemSchema = z
  .object({
    id: z.string(),
    slug: z.string().optional(),
    title: z.string(),
    duration: z.string(),
    type: z.enum(["video", "quiz", "assignment", "reading"]),
    isPreview: z.boolean().default(false),
    isCompleted: z.boolean().default(false),
    progress: z.enum(["not_started", "in_progress", "completed"]).optional(),
    isInReviewSpace: z.boolean().default(false),
    videoId: z.string().optional(),
    embedUrl: z.union([z.url(), z.instanceof(File)]).optional(),
    content: z.string().optional(),
    files: z
      .array(
        z.object({
          id: z.string(),
          fileUrl: z.string(),
          fileName: z.string(),
          fileSize: z.number(),
        }),
      )
      .optional(),
  })
  .strip();

export type LessonItemType = z.infer<typeof LessonItemSchema>;

export const SectionSchema: z.ZodType<SectionType> = z.lazy(() =>
  z
    .object({
      id: z.string(),
      title: z.string(),
      lessons: z.array(LessonItemSchema),
      children: z.array(SectionSchema).optional(),
    })
    .strip(),
);

export type SectionType = {
  id: string;
  title: string;
  lessons: LessonItemType[];
  children?: SectionType[];
};

export const CourseCurriculumSchema = z
  .object({
    courseId: z.number(),
    sections: z.array(SectionSchema),
    totalDuration: z.string(),
    totalLessons: z.number(),
  })
  .strip();

export type CourseCurriculumType = z.infer<typeof CourseCurriculumSchema>;

export const CreateSectionBodySchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
  })
  .strip();

export const CreateLessonBodySchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    videoId: z.string().optional(),
    embedUrl: z.union([z.string(), z.instanceof(File)]).optional(),
    duration: z.number().optional(),
    isPreview: z.boolean().default(false).optional(),
    isGenQues: z.boolean().default(false).optional(),
    isGenQuiz: z.boolean().default(false).optional(),
    promptForGenQues: z.string().optional(),
    promptForGenQuiz: z.string().optional(),
    content: z.string().optional(),
    files: z
      .array(
        z.object({
          fileUrl: z.string(),
          fileName: z.string(),
          fileSize: z.number(),
          isForAi: z.boolean().optional(),
        }),
      )
      .optional(),
  })
  .strip();
