import { z } from "zod";

type Category = {
  id: number;
  parentId: number | null;
  title: string;
  slug: string;
  parentCategory?: Category;
  subCategories?: Category[];
}

export const CategorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    id: z.number(),
    parentId: z.number().nullable(),
    title: z.string(),
    slug: z.string(),
    parentCategory: CategorySchema.optional(),
    subCategories: z.array(CategorySchema).optional(),
  }).strip()
);
export type CategoryType = z.infer<typeof CategorySchema>;

export const CategoryResponse = z.object({
  message: z.string(),
  categories: z.array(CategorySchema),
})
export type CategoryResponseType = z.infer<typeof CategoryResponse>;