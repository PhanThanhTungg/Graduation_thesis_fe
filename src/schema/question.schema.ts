import { z } from 'zod';

export const QuestionTypeEnum = z.enum([
  'true false', // dạng đúng sai
  'single select', // dạng câu hỏi chọn 1 đáp án đúng
  'multiple select', // dạng câu hỏi chọn nhiều đáp án đúng
  'open-ended', // dạng câu hỏi tự luận
]);

export const OptionsSchema = z.object({
  name: z.string().min(1).max(2),
  text: z.string().min(1).max(500),
})
export type OptionsType = z.infer<typeof OptionsSchema>;

export const QuestionSchema = z.object({
  id: z.uuid(),
  type: QuestionTypeEnum,
  request: z.string().optional(), // đoạn text hiển thị đầu mỗi câu hỏi, có thể là nội dung câu hỏi hoặc yêu cầu (vd: JS lầ gì?, Điền các từ còn thiếu vào chỗ trống, ...)
  options: OptionsSchema.optional(), // dùng cho các dạng câu hỏi có lựa chọn đáp án
  score: z.number().min(0).max(10).optional(), // điểm số mà AI chấm dựa trên câu trả lời của học viên
  aiExplanation: z.string().optional(), // giải thích của AI về đáp án đúng
  aiFeedback: z.string().optional(), // phản hồi của AI về câu trả lời của học viên
})
export type QuestionType = z.infer<typeof QuestionTypeEnum>;