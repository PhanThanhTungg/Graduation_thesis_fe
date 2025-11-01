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

const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[a-z]/, "At least one lowercase letter")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[0-9]/, "At least one number")
  .regex(/[^a-zA-Z0-9]/, "At least one special symbol");

export const UserLoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
}).strip();
export type UserLoginType = z.infer<typeof UserLoginSchema>;

export const UserRegisterSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email address"),
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).strict().refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})
export type UserRegisterType = z.infer<typeof UserRegisterSchema>;