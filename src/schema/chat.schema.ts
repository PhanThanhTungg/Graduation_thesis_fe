import { z } from "zod";

export const ConversationSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  isGroup: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  otherUser: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string().nullable(),
  }),
});

export type ConversationType = z.infer<typeof ConversationSchema>;

export type CreateOrGetConversationResponse = {
  message: string;
  data: ConversationType;
};
