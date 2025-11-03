import { z } from "zod"

// Enums from Prisma schema
export const AdminObjectEnum = z.enum([
  "user_management",
  "course_management", 
  "category_management"
])

export const AdminActionEnum = z.enum([
  "view",
  "edit"
])

// Base Admin schema
export const adminSchema = z.object({
  id: z.uuid(),
  fullName: z.string().min(1).max(100),
  email: z.email().max(100),
  adminRoleId: z.uuid()
})

export const adminLoginResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        accessToken: z.string(),
        admin: z.object({
            id: z.string(),
            email: z.email().max(100),
            fullName: z.string().min(1).max(100),
            role: z.string().nullable(),
            permissions: z.array(z.unknown())
        })
    })
})



// Admin Login schema
export const adminLoginSchema = z.object({
  email: z.email({
    message: "Please enter a valid email address"
  }),
  password: z.string().min(1, {
    message: "Password must be at least 1 character"
  })
})

// Admin Create schema
export const createAdminSchema = z.object({
  fullName: z.string().min(1, {
    message: "Full name is required"
  }).max(100, {
    message: "Full name must not exceed 100 characters"
  }),
  email: z.email({
    message: "Please enter a valid email address"
  }).max(100, {
    message: "Email must not exceed 100 characters"
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters"
  }),
  adminRoleId: z.string().uuid({
    message: "Invalid role ID"
  })
})

// Admin Update schema
export const updateAdminSchema = z.object({
  fullName: z.string().min(1, {
    message: "Full name is required"
  }).max(100, {
    message: "Full name must not exceed 100 characters"
  }).optional(),
  email: z.email({
    message: "Please enter a valid email address"
  }).max(100, {
    message: "Email must not exceed 100 characters"
  }).optional(),
  adminRoleId: z.uuid({
    message: "Invalid role ID"
  }).optional()
})

// Admin Role schema
export const adminRoleSchema = z.object({
  id: z.uuid(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  permissions: z.array(z.object({
    adminPermissionId: z.uuid(),
    adminPermission: z.object({
      object: AdminObjectEnum,
      action: AdminActionEnum
    })
  }))
})

// Admin Role Create/Update schema
export const adminRoleCreateUpdateSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required"
  }),
  description: z.string().optional(),
  permissions: z.array(z.object({
    object: AdminObjectEnum,
    action: AdminActionEnum
  }))
})

// Types
export type AdminLoginInput = z.infer<typeof adminLoginSchema>
export type AdminLoginResponse = z.infer<typeof adminLoginResponseSchema>
export type CreateAdminInput = z.infer<typeof createAdminSchema>
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>
export type AdminRoleInput = z.infer<typeof adminRoleCreateUpdateSchema>
export type Admin = z.infer<typeof adminSchema>
export type AdminRole = z.infer<typeof adminRoleSchema>
export type AdminObject = z.infer<typeof AdminObjectEnum>
export type AdminAction = z.infer<typeof AdminActionEnum>
