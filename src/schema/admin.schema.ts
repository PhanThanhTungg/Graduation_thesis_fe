import { z } from "zod";
import { PaginationSchema } from "./helpers.schema";

// Enums from Prisma schema
export const AdminObjectEnum = z.enum([
  "user_management",
  "course_management",
  "category_management",
]);

export const AdminActionEnum = z.enum(["view", "edit"]);

// Base Admin schema
export const adminSchema = z.object({
  id: z.uuid(),
  fullName: z.string().min(1).max(100),
  email: z.email().max(100),
  adminRoleId: z.uuid(),
});

export const adminLoginResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    accessToken: z.string(),
    admin: z.object({
      id: z.string(),
      email: z.email().max(100),
      fullName: z.string().min(1).max(100),
      role: z.string().nullable(),
      permissions: z.array(z.unknown()),
    }),
  }),
});

// Admin Login schema
export const adminLoginSchema = z.object({
  email: z.email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Password must be at least 1 character",
  }),
});

// Admin Create schema
export const createAdminSchema = z.object({
  fullName: z
    .string()
    .min(1, {
      message: "Full name is required",
    })
    .max(100, {
      message: "Full name must not exceed 100 characters",
    }),
  email: z
    .email({
      message: "Please enter a valid email address",
    })
    .max(100, {
      message: "Email must not exceed 100 characters",
    }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message:
        "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character",
    }),
  roleId: z.string().uuid({
    message: "Invalid role ID",
  }),
});

// Admin Update schema (without password)
export const updateAdminSchema = z.object({
  fullName: z
    .string()
    .min(1, {
      message: "Full name is required",
    })
    .max(100, {
      message: "Full name must not exceed 100 characters",
    })
    .optional(),
  email: z
    .email({
      message: "Please enter a valid email address",
    })
    .max(100, {
      message: "Email must not exceed 100 characters",
    })
    .optional(),
  roleId: z
    .string()
    .uuid({
      message: "Invalid role ID",
    })
    .optional(),
});

// Admin Change Password schema
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, {
    message: "Current password is required",
  }),
  newPassword: z
    .string()
    .min(6, {
      message: "New password must be at least 6 characters",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message:
        "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character",
    }),
});

// Admin Role schema
export const adminRoleSchema = z.object({
  id: z.uuid(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  permissions: z.array(
    z.object({
      adminPermissionId: z.uuid(),
      adminPermission: z.object({
        object: AdminObjectEnum,
        action: AdminActionEnum,
      }),
    }),
  ),
});

// Admin Role Create/Update schema
export const adminRoleCreateUpdateSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z.string().optional(),
  permissions: z.array(
    z.object({
      object: AdminObjectEnum,
      action: AdminActionEnum,
    }),
  ),
});

export const adminRoleBodySchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  permissionIds: z.array(z.uuid()).optional(),
});

export const adminAccountSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  email: z.string().email(),
  adminRoleId: z.string().uuid(),
  adminRole: z.object({
    id: z.string().uuid(),
    title: z.string(),
  }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// Admin Account List Response with Pagination
export const adminAccountListResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    items: z.array(adminAccountSchema),
    pagination: PaginationSchema,
  }),
});

// Admin Account Create Response
export const adminAccountCreateResponseSchema = z.object({
  message: z.string(),
  data: adminAccountSchema,
});

// Admin Account Update Response
export const adminAccountUpdateResponseSchema = z.object({
  message: z.string(),
  data: adminAccountSchema,
});

// Admin Change Password Response
export const changePasswordResponseSchema = z.object({
  message: z.string(),
});

// Admin Delete Response
export const adminDeleteResponseSchema = z.object({
  message: z.string(),
});

// Admin Account Query Params
export const adminAccountParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  keySearch: z.string().optional(),
  sortField: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Types
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type AdminLoginResponse = z.infer<typeof adminLoginResponseSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type AdminRoleInput = z.infer<typeof adminRoleCreateUpdateSchema>;
export type Admin = z.infer<typeof adminSchema>;
export type AdminRole = z.infer<typeof adminRoleSchema>;
export type AdminObject = z.infer<typeof AdminObjectEnum>;
export type AdminAction = z.infer<typeof AdminActionEnum>;
export type AdminRoleBody = z.infer<typeof adminRoleBodySchema>;
export type AdminAccount = z.infer<typeof adminAccountSchema>;
export type AdminAccountListResponse = z.infer<
  typeof adminAccountListResponseSchema
>;
export type AdminAccountCreateResponse = z.infer<
  typeof adminAccountCreateResponseSchema
>;
export type AdminAccountUpdateResponse = z.infer<
  typeof adminAccountUpdateResponseSchema
>;
export type ChangePasswordResponse = z.infer<
  typeof changePasswordResponseSchema
>;
export type AdminDeleteResponse = z.infer<typeof adminDeleteResponseSchema>;
export type AdminAccountParams = z.infer<typeof adminAccountParamsSchema>;
