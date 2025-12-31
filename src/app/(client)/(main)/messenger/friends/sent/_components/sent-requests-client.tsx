"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  getSentFriendRequests,
  cancelFriendRequest,
} from "@/friends/client/friends.service";
import { SentFriendRequest } from "@/schema/friend.schema";
import { showToast } from "@/lib/toast";

export default function SentRequestsClient() {
  const [requests, setRequests] = useState<SentFriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const data = await getSentFriendRequests();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching sent friend requests:", error);
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleCancel = async (friendId: string) => {
    setCancellingId(friendId);
    try {
      await cancelFriendRequest(friendId);
      showToast("success", "Friend request cancelled");
      setRequests((prev) => prev.filter((req) => req.friendId !== friendId));
    } catch (error) {
      showToast("error", "Failed to cancel friend request");
    } finally {
      setCancellingId(null);
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
            <p className="text-muted-foreground">No sent requests yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <h2 className="text-lg font-semibold mb-4">Sent Requests</h2>
      <div className="space-y-2">
        {requests.map((request) => (
          <div
            key={`${request.id}-${request.friendId}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Avatar className="size-12">
              <AvatarImage
                src={request.recipient.avatar || undefined}
                alt={request.recipient.name}
              />
              <AvatarFallback>
                {request.recipient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{request.recipient.name}</p>
              <p className="text-sm text-muted-foreground">
                {request.recipient.role === "teacher" ? "Teacher" : "Student"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCancel(request.friendId)}
              disabled={cancellingId === request.friendId}
            >
              {cancellingId === request.friendId ? "Cancelling..." : "Cancel"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
