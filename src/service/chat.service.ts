import { get, post, del } from "@/lib/request";
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

type CreateGroupResponse = {
  message: string;
  data: {
    id: string;
    name: string;
    isGroup: boolean;
    memberCount: number;
    createdAt: string;
    updatedAt: string | null;
  };
};

export const createGroup = async (
  name: string,
  userIds: string[],
): Promise<CreateGroupResponse["data"]> => {
  try {
    const response = await post<CreateGroupResponse>("/api/chat/group", {
      name,
      userIds,
    });

    if (
      response.status >= 200 &&
      response.status < 300 &&
      "data" in response.payload
    ) {
      return response.payload.data;
    }

    throw new Error(response.payload.message || "Failed to create group");
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
};

type ConversationMember = {
  userId: string;
  role: "admin" | "subadmin" | "member" | null;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
};

type GetConversationMembersResponse = {
  message: string;
  data: {
    members: ConversationMember[];
    currentUserRole: "admin" | "subadmin" | "member" | null;
  };
};

export const getConversationMembers = async (
  conversationId: string,
): Promise<GetConversationMembersResponse["data"]> => {
  try {
    const response = await get<GetConversationMembersResponse>(
      `/api/chat/conversation/${conversationId}/members`,
      undefined,
    );

    if (
      response.status >= 200 &&
      response.status < 300 &&
      "data" in response.payload
    ) {
      return response.payload.data;
    }

    throw new Error(response.payload.message || "Failed to get members");
  } catch (error) {
    console.error("Error getting conversation members:", error);
    throw error;
  }
};

type RemoveMemberResponse = {
  message: string;
  data: {
    removedUserId: string;
  };
};

export const removeMember = async (
  conversationId: string,
  userId: string,
): Promise<void> => {
  try {
    const response = await del<RemoveMemberResponse>(
      `/api/chat/conversation/${conversationId}/member`,
      { userId },
      undefined,
    );

    if (response.status >= 200 && response.status < 300) {
      return;
    }

    throw new Error(response.payload.message || "Failed to remove member");
  } catch (error) {
    console.error("Error removing member:", error);
    throw error;
  }
};

export type { ConversationMember };
