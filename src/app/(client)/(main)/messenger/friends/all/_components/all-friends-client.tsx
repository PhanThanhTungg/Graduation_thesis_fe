"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  searchFriends,
  addFriendRequest,
  getAcceptedFriends,
} from "@/friends/client/friends.service";
import { SearchedFriend } from "@/schema/friend.schema";
import { AcceptedFriend } from "@/schema/friend.schema";
import { showToast } from "@/lib/toast";
import { useSocket } from "@/components/providers/socket-provider";
import { getMyProfile } from "@/service/user.service";

export default function AllFriendsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [friends, setFriends] = useState<SearchedFriend[]>([]);
  const [acceptedFriendsList, setAcceptedFriendsList] = useState<
    AcceptedFriend[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState(true);
  const [addingFriendId, setAddingFriendId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const socket = useSocket();

  useEffect(() => {
    const fetchUserAndFriends = async () => {
      setIsLoadingFriends(true);
      try {
        const user = await getMyProfile();
        if (user) {
          setUserId(user.id);
        }
        const friendsData = await getAcceptedFriends();
        setAcceptedFriendsList(friendsData);
      } catch (error) {
        console.error("Error fetching user and friends:", error);
        setAcceptedFriendsList([]);
      } finally {
        setIsLoadingFriends(false);
      }
    };

    fetchUserAndFriends();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!debouncedSearch.trim()) {
        setFriends([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchFriends(debouncedSearch.trim(), 50);
        setFriends(results);
      } catch (error) {
        console.error("Error searching friends:", error);
        setFriends([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [debouncedSearch]);

  useEffect(() => {
    if (!socket || !userId) return;

    socket.emit("joinRoom", `user:${userId}`);

    const handleFriendRequestAccepted = (data: {
      userId: string;
      friendId: string;
      friend: {
        id: string;
        name: string;
        avatar: string | null;
        role: "teacher" | "student";
      };
    }) => {
      const friendToAdd: AcceptedFriend = {
        id: data.friend.id,
        name: data.friend.name,
        avatar: data.friend.avatar,
        role: data.friend.role,
        acceptedAt: new Date().toISOString(),
      };

      setAcceptedFriendsList((prev) => {
        const exists = prev.some((f) => f.id === friendToAdd.id);
        if (!exists) {
          return [friendToAdd, ...prev];
        }
        return prev;
      });

      if (data.friendId === userId || data.userId === userId) {
        setFriends((prev) =>
          prev.map((friend) =>
            friend.id === data.friend.id
              ? { ...friend, friendStatus: "accepted" as const }
              : friend,
          ),
        );
      }
    };

    const handleFriendRemoved = (data: {
      userId: string;
      friendId: string;
    }) => {
      setAcceptedFriendsList((prev) =>
        prev.filter((f) => f.id !== data.friendId && f.id !== data.userId),
      );
    };

    socket.on("friendRequestAccepted", handleFriendRequestAccepted);
    socket.on("friendRemoved", handleFriendRemoved);

    return () => {
      socket.off("friendRequestAccepted", handleFriendRequestAccepted);
      socket.off("friendRemoved", handleFriendRemoved);
      socket.emit("leaveRoom", `user:${userId}`);
    };
  }, [socket, userId]);

  const { acceptedFriends, nonFriends } = useMemo(() => {
    const accepted = friends.filter(
      (friend) => friend.friendStatus === "accepted",
    );
    const non = friends.filter((friend) => friend.friendStatus !== "accepted");
    return { acceptedFriends: accepted, nonFriends: non };
  }, [friends]);

  const handleAddFriend = async (friendId: string) => {
    setAddingFriendId(friendId);
    try {
      await addFriendRequest(friendId);
      showToast("success", "Friend request sent successfully");
      setFriends((prev) =>
        prev.map((friend) =>
          friend.id === friendId
            ? { ...friend, friendStatus: "pending" as const }
            : friend,
        ),
      );
    } catch (error) {
      showToast("error", "Failed to send friend request");
    } finally {
      setAddingFriendId(null);
    }
  };

  const hasSearchQuery = debouncedSearch.trim().length > 0;

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            type="text"
            placeholder="Search by name..."
            className="pl-10 w-full max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {!hasSearchQuery ? (
        isLoadingFriends ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : acceptedFriendsList.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">No friends yet.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Friends</h2>
            <div className="space-y-2">
              {acceptedFriendsList.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="size-12">
                    <AvatarImage
                      src={friend.avatar || undefined}
                      alt={friend.name}
                    />
                    <AvatarFallback>
                      {friend.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {friend.role === "teacher" ? "Teacher" : "Student"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Searching...</p>
          </div>
        </div>
      ) : friends.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">No results found</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-8">
          {acceptedFriends.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Friends</h2>
              <div className="space-y-2">
                {acceptedFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="size-12">
                      <AvatarImage
                        src={friend.avatar || undefined}
                        alt={friend.name}
                      />
                      <AvatarFallback>
                        {friend.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{friend.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {friend.role === "teacher" ? "Teacher" : "Student"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {nonFriends.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Not friends yet</h2>
              <div className="space-y-2">
                {nonFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="size-12">
                      <AvatarImage
                        src={friend.avatar || undefined}
                        alt={friend.name}
                      />
                      <AvatarFallback>
                        {friend.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{friend.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {friend.role === "teacher" ? "Teacher" : "Student"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddFriend(friend.id)}
                      disabled={
                        addingFriendId === friend.id ||
                        friend.friendStatus === "pending"
                      }
                    >
                      <UserPlus className="size-4" />
                      {addingFriendId === friend.id
                        ? "Sending..."
                        : friend.friendStatus === "pending"
                          ? "Pending"
                          : "Add friend"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
