import { z } from "zod";

export const FriendStatusEnum = z.enum(["pending", "accepted", "blocked"]);
export type FriendStatus = z.infer<typeof FriendStatusEnum>;

export const SearchedFriendSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().nullable(),
  role: z.enum(["teacher", "student"]),
  friendStatus: FriendStatusEnum.nullable(),
});

export type SearchedFriend = z.infer<typeof SearchedFriendSchema>;

export type SearchFriendsResponse = {
  message: string;
  data: SearchedFriend[];
};

export const FriendRequestSenderSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().nullable(),
  role: z.enum(["teacher", "student"]),
});

export type FriendRequestSender = z.infer<typeof FriendRequestSenderSchema>;

export const FriendRequestSchema = z.object({
  id: z.string(),
  friendId: z.string(),
  sender: FriendRequestSenderSchema,
  createdAt: z.string(),
});

export type FriendRequest = z.infer<typeof FriendRequestSchema>;

export type GetFriendRequestsResponse = {
  message: string;
  data: FriendRequest[];
};

export type AddFriendRequestResponse = {
  message: string;
  data: {
    userId: string;
    friendId: string;
    status: string;
  };
};

export const SentFriendRequestRecipientSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().nullable(),
  role: z.enum(["teacher", "student"]),
});

export type SentFriendRequestRecipient = z.infer<
  typeof SentFriendRequestRecipientSchema
>;

export const SentFriendRequestSchema = z.object({
  id: z.string(),
  friendId: z.string(),
  recipient: SentFriendRequestRecipientSchema,
  createdAt: z.string(),
});

export type SentFriendRequest = z.infer<typeof SentFriendRequestSchema>;

export type GetSentFriendRequestsResponse = {
  message: string;
  data: SentFriendRequest[];
};

export const AcceptedFriendSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().nullable(),
  role: z.enum(["teacher", "student"]),
  acceptedAt: z.string(),
});

export type AcceptedFriend = z.infer<typeof AcceptedFriendSchema>;

export type GetAcceptedFriendsResponse = {
  message: string;
  data: AcceptedFriend[];
};
