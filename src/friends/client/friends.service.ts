import { get, post, del, patch } from "@/lib/request";
import {
  SearchFriendsResponse,
  SearchedFriend,
  GetFriendRequestsResponse,
  FriendRequest,
  AddFriendRequestResponse,
  GetSentFriendRequestsResponse,
  SentFriendRequest,
  GetAcceptedFriendsResponse,
  AcceptedFriend,
} from "@/schema/friend.schema";

export const searchFriends = async (
  keySearch: string,
  limit?: number,
): Promise<SearchedFriend[]> => {
  try {
    const searchParams: Record<string, string> = {
      keySearch,
    };

    if (limit) {
      searchParams.limit = limit.toString();
    }

    const response = await get<SearchFriendsResponse>(
      "/api/friends/search",
      searchParams,
    );

    if (response.status === 200 && "data" in response.payload) {
      return response.payload.data;
    }

    throw new Error(response.payload.message || "Failed to search friends");
  } catch (error) {
    console.error("Error searching friends:", error);
    throw error;
  }
};

export const addFriendRequest = async (
  friendId: string,
): Promise<AddFriendRequestResponse["data"]> => {
  try {
    const response = await post<AddFriendRequestResponse>(
      "/api/friends/request",
      { friendId },
    );

    if (
      response.status >= 200 &&
      response.status < 300 &&
      "data" in response.payload
    ) {
      return response.payload.data;
    }

    throw new Error(
      response.payload.message || "Failed to send friend request",
    );
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
};

export const getFriendRequests = async (): Promise<FriendRequest[]> => {
  try {
    const response = await get<GetFriendRequestsResponse>(
      "/api/friends/requests",
      undefined,
    );

    if (response.status === 200 && "data" in response.payload) {
      return response.payload.data;
    }

    throw new Error(
      response.payload.message || "Failed to get friend requests",
    );
  } catch (error) {
    console.error("Error getting friend requests:", error);
    throw error;
  }
};

export const getSentFriendRequests = async (): Promise<SentFriendRequest[]> => {
  try {
    const response = await get<GetSentFriendRequestsResponse>(
      "/api/friends/sent",
      undefined,
    );

    if (response.status === 200 && "data" in response.payload) {
      return response.payload.data;
    }

    throw new Error(
      response.payload.message || "Failed to get sent friend requests",
    );
  } catch (error) {
    console.error("Error getting sent friend requests:", error);
    throw error;
  }
};

export const cancelFriendRequest = async (friendId: string): Promise<void> => {
  try {
    const response = await del<{
      message: string;
      data: { userId: string; friendId: string };
    }>(`/api/friends/request/${friendId}`, undefined);

    if (response.status >= 200 && response.status < 300) {
      return;
    }

    throw new Error(
      response.payload.message || "Failed to cancel friend request",
    );
  } catch (error) {
    console.error("Error cancelling friend request:", error);
    throw error;
  }
};

export const acceptFriendRequest = async (friendId: string): Promise<void> => {
  try {
    const response = await patch<{
      message: string;
      data: {
        userId: string;
        friendId: string;
        status: string;
        acceptedAt: string | null;
      };
    }>(`/api/friends/request/${friendId}/accept`, {});

    if (response.status >= 200 && response.status < 300) {
      return;
    }

    throw new Error(
      response.payload.message || "Failed to accept friend request",
    );
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  }
};

export const getAcceptedFriends = async (): Promise<AcceptedFriend[]> => {
  try {
    const response = await get<GetAcceptedFriendsResponse>(
      "/api/friends/accepted",
      undefined,
    );

    if (response.status === 200 && "data" in response.payload) {
      return response.payload.data;
    }

    throw new Error(
      response.payload.message || "Failed to get accepted friends",
    );
  } catch (error) {
    console.error("Error getting accepted friends:", error);
    throw error;
  }
};

export const unfriend = async (friendId: string): Promise<void> => {
  try {
    const response = await del<{
      message: string;
      data: { userId: string; friendId: string };
    }>(`/api/friends/${friendId}`, undefined);

    if (response.status >= 200 && response.status < 300) {
      return;
    }

    throw new Error(response.payload.message || "Failed to unfriend");
  } catch (error) {
    console.error("Error unfriending:", error);
    throw error;
  }
};
