import { z } from "zod";
import { TeacherSchema } from "./user.schema";
import { CategorySchema } from "./category.schema";

export const courseDescriptionSchema = z.object({
  headline: z.string().optional(),
  targetKnowledges: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  suitableParticipants: z.array(z.string()).optional(),
  detail: z.string().optional(),
}).strip();

export const CourseSchema = z.object({
  id: z.number(),
  title: z.string(),
  courseDescription: courseDescriptionSchema,
  thumbnailUrl: z.url().optional(),
  price: z.number(),
  teacher: TeacherSchema,
  rating: z.number(),
  slug: z.string(),
  isPublished: z.boolean().default(true),
  updatedAt: z.date(),
  countStudent: z.number().optional(),
}).strip()
export type CourseType = z.infer<typeof CourseSchema>;

export const extendedCourseSchema = CourseSchema.extend({
  countStudent: z.number(),
  category: CategorySchema,
}).strip()
export type ExtendedCourseType = z.infer<typeof extendedCourseSchema>;

export const CreateCourseBodySchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  thumbnailUrl: z
    .union([
      z.url(),
      z.instanceof(File).refine((f) => f.type.startsWith("image/"), { message: "File must be an image" }),
    ])
    .optional(),
  price: z.number().min(1, { message: "Price must be at least 1" }),
  categoryId: z.uuid("You need to select a valid category"),
  courseDescription: courseDescriptionSchema,
}).strip()