"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  getFriendRequests,
  acceptFriendRequest,
} from "@/friends/client/friends.service";
import { FriendRequest } from "@/schema/friend.schema";
import { useSocket } from "@/components/providers/socket-provider";
import { getMyProfile } from "@/service/user.service";
import { showToast } from "@/lib/toast";

export default function FriendRequestsClient() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const socket = useSocket();

  useEffect(() => {
    const fetchUserAndRequests = async () => {
      setIsLoading(true);
      try {
        const user = await getMyProfile();
        if (user) {
          setUserId(user.id);
          if (socket) {
            socket.emit("joinRoom", `user:${user.id}`);
          }
        }
        const data = await getFriendRequests();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndRequests();
  }, [socket]);

  useEffect(() => {
    if (!socket || !userId) return;

    socket.emit("joinRoom", `user:${userId}`);

    const handleNewFriendRequest = (data: FriendRequest) => {
      if (data.friendId === userId) {
        setRequests((prev) => [data, ...prev]);
      }
    };

    const handleFriendRequestCancelled = (data: {
      userId: string;
      friendId: string;
    }) => {
      if (data.friendId === userId) {
        setRequests((prev) => prev.filter((req) => req.id !== data.userId));
      }
    };

    const handleFriendRequestAccepted = (data: {
      userId: string;
      friendId: string;
    }) => {
      if (data.friendId === userId) {
        setRequests((prev) => prev.filter((req) => req.id !== data.userId));
      }
    };

    socket.on("newFriendRequest", handleNewFriendRequest);
    socket.on("friendRequestCancelled", handleFriendRequestCancelled);
    socket.on("friendRequestAccepted", handleFriendRequestAccepted);

    return () => {
      socket.off("newFriendRequest", handleNewFriendRequest);
      socket.off("friendRequestCancelled", handleFriendRequestCancelled);
      socket.off("friendRequestAccepted", handleFriendRequestAccepted);
      socket.emit("leaveRoom", `user:${userId}`);
    };
  }, [socket, userId]);

  const handleAccept = async (friendId: string) => {
    setAcceptingId(friendId);
    try {
      await acceptFriendRequest(friendId);
      showToast("success", "Friend request accepted");
      setRequests((prev) => prev.filter((req) => req.id !== friendId));
    } catch (error) {
      showToast("error", "Failed to accept friend request");
    } finally {
      setAcceptingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col p-6">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-1 flex-col p-6">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">No friend requests yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <h2 className="text-lg font-semibold mb-4">Friend Requests</h2>
      <div className="space-y-2">
        {requests.map((request) => (
          <div
            key={`${request.id}-${request.friendId}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Avatar className="size-12">
              <AvatarImage
                src={request.sender.avatar || undefined}
                alt={request.sender.name}
              />
              <AvatarFallback>
                {request.sender.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{request.sender.name}</p>
              <p className="text-sm text-muted-foreground">
                {request.sender.role === "teacher" ? "Teacher" : "Student"}
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleAccept(request.id)}
              disabled={acceptingId === request.id}
            >
              {acceptingId === request.id ? "Accepting..." : "Accept"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
