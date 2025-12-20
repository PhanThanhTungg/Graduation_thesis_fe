import { post } from "@/lib/request";
import {
  CreateOrGetConversationResponse,
  ConversationType,
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
