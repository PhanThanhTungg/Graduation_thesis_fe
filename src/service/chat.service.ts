import { get, post } from "@/lib/request";
import {
  CreateOrGetConversationResponse,
  ConversationType,
  SendMessageResponse,
  MessageType,
  GetConversationsResponse,
  ConversationListItemType,
  GetMessagesResponse,
} from "@/schema/chat.schema";

export const createOrGetConversation = async (
  userId: string,
): Promise<ConversationType> => {
  try {
    const response = await post<CreateOrGetConversationResponse>(
      "/api/chat/conversation",
      { userId },
    );

    if (
      response.status >= 200 &&
      response.status < 300 &&
      "data" in response.payload
    ) {
      return response.payload.data;
    }

    throw new Error(
      response.payload.message || "Failed to create or get conversation",
    );
  } catch (error) {
    console.error("Error creating or getting conversation:", error);
    throw error;
  }
};

export const sendMessage = async (
  conversationId: string,
  message: string,
): Promise<MessageType> => {
  try {
    const response = await post<SendMessageResponse>("/api/chat/message", {
      conversationId,
      message,
    });

    if (
      response.status >= 200 &&
      response.status < 300 &&
      "data" in response.payload
    ) {
      return response.payload.data;
    }

    throw new Error(response.payload.message || "Failed to send message");
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getConversations = async (): Promise<
  ConversationListItemType[]
> => {
  try {
    const response = await get<GetConversationsResponse>(
      "/api/chat/conversations",
      undefined,
    );

    if (
      response.status >= 200 &&
      response.status < 300 &&
      "data" in response.payload
    ) {
      return response.payload.data;
    }

    throw new Error(response.payload.message || "Failed to get conversations");
  } catch (error) {
    console.error("Error getting conversations:", error);
    throw error;
  }
};

export const getMessages = async (
  conversationId: string,
): Promise<MessageType[]> => {
  try {
    const response = await get<GetMessagesResponse>(
      `/api/chat/conversation/${conversationId}/messages`,
      undefined,
    );

    if (
      response.status >= 200 &&
      response.status < 300 &&
      "data" in response.payload
    ) {
      return response.payload.data;
    }

    throw new Error(response.payload.message || "Failed to get messages");
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
};
