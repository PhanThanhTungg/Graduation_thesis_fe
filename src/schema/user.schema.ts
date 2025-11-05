import { z } from "zod";
import { CountrySchema } from "./country.schema";

export const UserSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.email(),
  role: z.enum(["teacher", "student"]),
  emailVerified: z.boolean(),
  avatarUrl: z.url().nullable(),
  status: z.enum(["active", "inactive", "banned"]),
  country: CountrySchema,
}).strip();
export type UserType = z.infer<typeof UserSchema>;


export const TeacherSchema = UserSchema.extend({
  bio: z.string().optional(),
  headline: z.string().optional(),
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
  country: CountrySchema,
}).strict().refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})
export type UserRegisterType = z.infer<typeof UserRegisterSchema>;


export type UserAuthResponseType = {
  message: string;
  data: {
    accessToken: string;
    user: UserType;
  }
}

export const UpdateUserBodySchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email address"),
  country: CountrySchema,
  avatarUrl: z.url().nullable(),
  role: z.enum(["teacher", "student"]),
})
export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>;