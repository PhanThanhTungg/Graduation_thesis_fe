import { z } from "zod";

export const StudentBasicInfoSchema = z
  .object({
    id: z.string(),
    fullName: z.string(),
    email: z.string().email(),
    avatarUrl: z.string().optional(),
    country: z.string(),
    status: z.string(),
    createdAt: z.coerce.date(),
  })
  .strip();

export type StudentBasicInfoType = z.infer<typeof StudentBasicInfoSchema>;

export const StudentLessonProgressSchema = z
  .object({
    lessonId: z.string(),
    lessonTitle: z.string(),
    progress: z.enum(["not_started", "in_progress", "completed"]),
    chapterTitle: z.string(),
  })
  .strip();

export type StudentLessonProgressType = z.infer<
  typeof StudentLessonProgressSchema
>;

export const StudentWithProgressSchema = StudentBasicInfoSchema.extend({
  lessonProgress: z.array(StudentLessonProgressSchema),
  totalLessons: z.number(),
  completedLessons: z.number(),
  inProgressLessons: z.number(),
  completionPercentage: z.number(),
}).strip();

export type StudentWithProgressType = z.infer<typeof StudentWithProgressSchema>;

export const GetStudentsOfCourseResponseSchema = z
  .object({
    courseId: z.string(),
    courseName: z.string(),
    students: z.array(StudentWithProgressSchema),
    totalStudents: z.number(),
  })
  .strip();

export type GetStudentsOfCourseResponseType = z.infer<
  typeof GetStudentsOfCourseResponseSchema
>;

export const CourseStudentStatsSchema = z
  .object({
    totalStudents: z.number(),
    completedCount: z.number(),
    inProgressCount: z.number(),
    notStartedCount: z.number(),
    averageCompletionPercentage: z.number(),
  })
  .strip();

export type CourseStudentStatsType = z.infer<typeof CourseStudentStatsSchema>;
