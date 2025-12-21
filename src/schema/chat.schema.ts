import { z } from "zod";

export const ConversationSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  isGroup: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  otherUser: z
    .object({
      id: z.string(),
      name: z.string(),
      avatar: z.string().nullable(),
    })
    .optional(),
});

export type ConversationType = z.infer<typeof ConversationSchema>;

export type CreateOrGetConversationResponse = {
  message: string;
  data: ConversationType;
};

export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  message: z.string(),
  senderId: z.string(),
  sender: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string().nullable(),
  }),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export type MessageType = z.infer<typeof MessageSchema>;

export type SendMessageResponse = {
  message: string;
  data: MessageType;
};

export const ConversationListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().nullable(),
  isGroup: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  otherUser: z
    .object({
      id: z.string(),
      name: z.string(),
      avatar: z.string().nullable(),
    })
    .optional(),
  lastMessage: z
    .object({
      id: z.string(),
      message: z.string().nullable(),
      senderId: z.string(),
      senderName: z.string(),
      createdAt: z.string(),
    })
    .optional(),
});

export type ConversationListItemType = z.infer<
  typeof ConversationListItemSchema
>;

export type GetConversationsResponse = {
  message: string;
  data: ConversationListItemType[];
};

export type GetMessagesResponse = {
  message: string;
  data: MessageType[];
};
