import { z } from "zod";

export const ChapterTreeItemSchema: z.ZodType<ChapterTreeItemType> = z.lazy(() =>
  z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    position: z.number(),
    parentId: z.string().nullable().optional(),
    children: z.array(ChapterTreeItemSchema),
  }).strip()
);

export type ChapterTreeItemType = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  position: number;
  parentId?: string | null;
  children: ChapterTreeItemType[];
};

export const CreateChapterSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  parentId: z.string().optional(),
}).strip();

export type CreateChapterType = z.infer<typeof CreateChapterSchema>;

