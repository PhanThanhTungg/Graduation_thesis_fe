import { z } from "zod";

export const DiscountTypeEnum = z.enum(["percentage", "fixed_amount"]);
export const StatusEnum = z.enum(["active", "warning", "inactive"]);

export const VoucherSchema = z.object({
  id: z.string(),
  code: z.string(),
  courseId: z.string().nullable(),
  discountType: DiscountTypeEnum,
  discountValue: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  usageLimit: z.number().nullable(),
  usedCount: z.number(),
  createdBy: z.string(),
  status: StatusEnum,
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  course: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    price: z.number(),
  }).nullable().optional(),
  creator: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string(),
  }).optional(),
});

export const CreateVoucherSchema = z.object({
  code: z.string().min(1, "Voucher code is required"),
  courseId: z.string().optional(),
  discountType: DiscountTypeEnum,
  discountValue: z.number().min(0, "Discount value must be positive"),
  startDate: z.string(),
  endDate: z.string(),
  usageLimit: z.number().min(1).optional(),
});

export const UpdateVoucherSchema = z.object({
  code: z.string().optional(),
  courseId: z.string().optional(),
  discountType: DiscountTypeEnum.optional(),
  discountValue: z.number().min(0).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  usageLimit: z.number().min(1).optional(),
  status: StatusEnum.optional(),
});

export const ApplyVoucherSchema = z.object({
  code: z.string().min(1, "Voucher code is required"),
  courseId: z.string().min(1, "Course ID is required"),
});

export type VoucherType = z.infer<typeof VoucherSchema>;
export type CreateVoucherType = z.infer<typeof CreateVoucherSchema>;
export type UpdateVoucherType = z.infer<typeof UpdateVoucherSchema>;
export type ApplyVoucherType = z.infer<typeof ApplyVoucherSchema>;
export type DiscountType = z.infer<typeof DiscountTypeEnum>;
export type StatusType = z.infer<typeof StatusEnum>;
