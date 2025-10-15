import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  email: z.email(),
  role: z.enum(["teacher", "student"]),
  emailVerified: z.boolean(),
  avatarUrl: z.url().optional(),
})

export const TeacherSchema = UserSchema.extend({
  bio: z.string().optional(),
  headline: z.string().optional(),
  country: z.string().optional(),
  website: z.url().optional(),
  facebook: z.url().optional(),
  linkedin: z.url().optional(),
  youtube: z.url().optional(),
}).strip()
export type TeacherType = z.infer<typeof TeacherSchema>;  