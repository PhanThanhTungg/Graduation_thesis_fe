import { z } from "zod";
import { TeacherSchema } from "./user.schema";
import { CategorySchema } from "./category.schema";

export const CourseSchema = z.object({
  id: z.number(),
  title: z.string(),
  courseDescription: z.object({
    headline: z.string().optional(),
    targetKnowledges: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    suitableParticipants: z.array(z.string()).optional(),
    detail: z.string().optional(),
  }).strip(),
  thumbnailUrl: z.url().optional(),
  price: z.number(),
  teacher: TeacherSchema,
  rating: z.number(),
  slug: z.string(),
  updatedAt: z.date(),
}).strip()
export type CourseType = z.infer<typeof CourseSchema>;

export const extendedCourseSchema = CourseSchema.extend({
  countStudent: z.number(),
  category: CategorySchema,
}).strip()
export type ExtendedCourseType = z.infer<typeof extendedCourseSchema>;