import { z } from "zod";

type Category = {
  id: string;
  parentId: number | null;
  title: string;
  slug: string;
  children?: Category[];
}

export const CategorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    id: z.string(),
    parentId: z.number().nullable(),
    title: z.string(),
    slug: z.string(),
    children: z.array(CategorySchema).optional(),
  }).strip()
);
export type CategoryType = z.infer<typeof CategorySchema>;

export const CategoryResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    categories: z.array(CategorySchema),
  })
})
export type CategoryResponseType = z.infer<typeof CategoryResponseSchema>;