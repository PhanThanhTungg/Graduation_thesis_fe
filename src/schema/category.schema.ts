import { z } from "zod";

type Category = {
  id: string;
  parentId: string | null;
  title: string;
  slug: string;
  children?: Category[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export const CategorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    id: z.string(),
    parentId: z.string().nullable(),
    title: z.string(),
    slug: z.string(),
    children: z.array(CategorySchema).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    deletedAt: z.string().nullable().optional(),
  }).strip()
);

// Schema for creating a new category
export const CreateCategorySchema = z.object({
  title: z.string().min(1, "Title is required"),
  parentId: z.string().optional(),
});

export const CreateCategoryResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    parentId: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable(),
  })
});
export type CategoryType = z.infer<typeof CategorySchema>;

export const CategoryResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    categories: z.array(CategorySchema),
  })
})
export type CategoryResponseType = z.infer<typeof CategoryResponseSchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type CreateCategoryResponse = z.infer<typeof CreateCategoryResponseSchema>;