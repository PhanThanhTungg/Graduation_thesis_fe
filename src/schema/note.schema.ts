import { z } from 'zod';

// Base Note Schema - note object cơ bản
export const NoteSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  lessonId: z.uuid(),
  content: z.string().min(1, "Content must be at least 1 character long").max(5000, "Content must be at most 5000 characters long"),
  timestamp: z.number().min(0, "Timestamp must be a non-negative number"),
  createdAt: z.coerce.date()
}).strip();
export type NoteType = z.infer<typeof NoteSchema>;

// Note with lesson info (for create/update response)
export const NoteWithLessonSchema = NoteSchema.extend({
  lesson: z.object({
    id: z.uuid(),
    title: z.string(),
    slug: z.string(),
    chapter: z.object({
      course: z.object({
        id: z.uuid(),
        title: z.string(),
        slug: z.string(),
      }).strip(),
    }).strip(),
  }).strip().optional(),
}).strip();
export type NoteWithLessonType = z.infer<typeof NoteWithLessonSchema>;

// Note with lesson info (for course notes list)
export const NoteWithLessonInfoSchema = NoteSchema.extend({
  lesson: z.object({
    id: z.uuid(),
    title: z.string(),
    slug: z.string(),
  }).strip(),
}).strip();
export type NoteWithLessonInfoType = z.infer<typeof NoteWithLessonInfoSchema>;

// Create Note Body Schema - dùng cho tạo note mới
export const CreateNoteBodySchema = z.object({
  lessonId: z.uuid({ message: "Lesson ID is required" }),
  content: z.string()
    .min(1, { message: "Content is required" })
    .max(5000, { message: "Content must be at most 5000 characters" }),
  timestamp: z.number()
    .min(0, { message: "Timestamp must be a non-negative number" })
    .int({ message: "Timestamp must be an integer" }),
}).strip();
export type CreateNoteBodyType = z.infer<typeof CreateNoteBodySchema>;

// Update Note Body Schema - dùng cho cập nhật note
export const UpdateNoteBodySchema = z.object({
  content: z.string()
    .min(1, { message: "Content is required" })
    .max(5000, { message: "Content must be at most 5000 characters" })
    .optional(),
  timestamp: z.number()
    .min(0, { message: "Timestamp must be a non-negative number" })
    .int({ message: "Timestamp must be an integer" })
    .optional(),
}).strip();
export type UpdateNoteBodyType = z.infer<typeof UpdateNoteBodySchema>;

// API Response Schemas

// Create Note Response - trả về note với lesson info đầy đủ
export const CreateNoteResponseSchema = z.object({
  message: z.string(),
  data: NoteWithLessonSchema,
}).strip();
export type CreateNoteResponseType = z.infer<typeof CreateNoteResponseSchema>;

// Get Notes By Lesson Response - trả về lesson info, notes array và total
export const GetNotesByLessonResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    lesson: z.object({
      id: z.string().uuid(),
      title: z.string(),
    }).strip().nullable(),
    notes: z.array(NoteSchema),
    total: z.number(),
  }).strip(),
}).strip();
export type GetNotesByLessonResponseType = z.infer<typeof GetNotesByLessonResponseSchema>;

// Get Notes By Course Response - trả về course info, notes array với lesson info và total
export const GetNotesByCourseResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    course: z.object({
      id: z.string().uuid(),
      title: z.string(),
      slug: z.string(),
      thumbnailUrl: z.string().nullable(),
    }).strip().nullable(),
    notes: z.array(NoteWithLessonInfoSchema),
    total: z.number(),
  }).strip(),
}).strip();
export type GetNotesByCourseResponseType = z.infer<typeof GetNotesByCourseResponseSchema>;

// Update Note Response - trả về note với lesson info
export const UpdateNoteResponseSchema = z.object({
  message: z.string(),
  data: NoteWithLessonSchema,
}).strip();
export type UpdateNoteResponseType = z.infer<typeof UpdateNoteResponseSchema>;

// Delete Note Response - trả về data: null
export const DeleteNoteResponseSchema = z.object({
  message: z.string(),
  data: z.null(),
}).strip();
export type DeleteNoteResponseType = z.infer<typeof DeleteNoteResponseSchema>;

