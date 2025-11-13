import { string, z } from "zod";
import { TeacherSchema } from "./user.schema";
import { CategorySchema } from "./category.schema";
import { PaginationSchema } from "./helpers.schema";

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
  createdAt: z.date().optional(),
  updatedAt: z.date(),
  countStudent: z.number().optional(),
}).strip()
export type CourseType = z.infer<typeof CourseSchema>;

export const extendedCourseSchema = CourseSchema.extend({
  countStudent: z.number(),
  category: CategorySchema,
}).strip()
export type ExtendedCourseType = z.infer<typeof extendedCourseSchema>;

export const DetailCourseSchema = extendedCourseSchema
export type DetailCourseType = z.infer<typeof DetailCourseSchema>;

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


export const GetAllCourseResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    items: z.array(extendedCourseSchema),
    pagination: PaginationSchema
  })
}).strip();
export type GetAllCourseResponseType = z.infer<typeof GetAllCourseResponseSchema>;

export const GetCourseBySlugResponseSchema = z.object({
  message: z.string(),
  data: DetailCourseSchema
}).strip();
export type GetCourseBySlugResponseType = z.infer<typeof GetCourseBySlugResponseSchema>;
// Admin course schema
export const AdminCourseItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnailUrl: z.string().nullable(),
  price: z.number(),
  countStudent: z.number(),
  isPublished: z.boolean(),
  teacher: z.object({
    id: z.string(),
    name: z.string(),
  }),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }).nullable(),
  createdAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
}).strip()
export type AdminCourseItemType = z.infer<typeof AdminCourseItemSchema>;
