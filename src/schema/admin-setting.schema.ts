import { z } from "zod";

export const AdminSettingSchema = z.object({
  id: z.string(),
  webTitle: z.string().nullable(),
  webFavicon: z.string().nullable(),
  webDescription: z.string().nullable(),
  webKeywords: z.array(z.string()),
  webAuthor: z.string().nullable(),
  webCopyright: z.string().nullable(),
  learningSteps: z.array(z.number()),
  lastStepFromLearningToReview: z.number(),
  iniInterval: z.number(),
  iniEasyInterval: z.number(),
  leechThreshold: z.number(),
  feeUploadPer100Mb: z.number(),
  percentCommission: z.number(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export type AdminSettingType = z.infer<typeof AdminSettingSchema>;

export const UpdateAdminSettingSchema = z.object({
  webTitle: z.string().optional(),
  webFavicon: z.string().optional(),
  webDescription: z.string().optional(),
  webKeywords: z.array(z.string()).optional(),
  webAuthor: z.string().optional(),
  webCopyright: z.string().optional(),
  learningSteps: z.array(z.number()).optional(),
  lastStepFromLearningToReview: z.number().optional(),
  iniInterval: z.number().optional(),
  iniEasyInterval: z.number().optional(),
  leechThreshold: z.number().optional(),
});

export type UpdateAdminSettingType = z.infer<typeof UpdateAdminSettingSchema>;
