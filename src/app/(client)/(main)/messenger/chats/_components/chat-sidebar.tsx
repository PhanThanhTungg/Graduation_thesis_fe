"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { searchUsers } from "@/service/user.service";
import { SearchedUser } from "@/schema/user.schema";
import { useOnlineStatus } from "@/hooks/use-online-status";
import {
  createOrGetConversation,
  getConversations,
} from "@/service/chat.service";
import {
  ConversationType,
  ConversationListItemType,
} from "@/schema/chat.schema";
import { showToast } from "@/lib/toast";
import { formatTimeAgo } from "@/lib/helpers";
import { useSocket } from "@/components/providers/socket-provider";

interface ChatSidebarProps {
  onConversationSelect?: (conversation: ConversationType) => void;
}

export function ChatSidebar({ onConversationSelect }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [creatingConversation, setCreatingConversation] = useState<
    string | null
  >(null);
  const [conversations, setConversations] = useState<
    ConversationListItemType[]
  >([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  const conversationUserIds = useMemo(
    () =>
      conversations
        .filter((conv) => !conv.isGroup && conv.otherUser)
        .map((conv) => conv.otherUser!.id),
    [conversations],
  );

  const { isOnline: isConversationUserOnline } =
    useOnlineStatus(conversationUserIds);

  const searchUserIds = useMemo(
    () => searchResults.map((user) => user.id),
    [searchResults],
  );
  const { isOnline: isSearchUserOnline } = useOnlineStatus(searchUserIds, {
    enabled: searchResults.length > 0,
  });

  const handleUserClick = async (userId: string) => {
    if (creatingConversation) return;

    setCreatingConversation(userId);
    try {
      const conversation = await createOrGetConversation(userId);
      if (onConversationSelect) {
        onConversationSelect(conversation);
      }
      setSearchQuery("");
      setSearchResults([]);
      fetchConversations();
    } catch (error) {
      console.error("Error creating conversation:", error);
      showToast("error", "Failed to create conversation");
    } finally {
      setCreatingConversation(null);
    }
  };

  const handleConversationClick = (
    conversationItem: ConversationListItemType,
  ) => {
    if (conversationItem.isGroup || !conversationItem.otherUser) {
      return;
    }
    const conversation: ConversationType = {
      id: conversationItem.id,
      name: conversationItem.name,
      isGroup: conversationItem.isGroup,
      createdAt: conversationItem.createdAt,
      updatedAt: conversationItem.updatedAt,
      otherUser: conversationItem.otherUser,
    };
    if (onConversationSelect) {
      onConversationSelect(conversation);
    }
  };

  const fetchConversations = async () => {
    setIsLoadingConversations(true);
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      showToast("error", "Failed to load conversations");
    } finally {
      setIsLoadingConversations(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleConversationUpdated = (data: {
      conversationId: string;
      lastMessage: {
        id: string;
        message: string;
        senderId: string;
        senderName: string;
        createdAt: string;
      };
      updatedAt: string;
    }) => {
      setConversations((prev) => {
        const index = prev.findIndex((conv) => conv.id === data.conversationId);
        if (index === -1) {
          fetchConversations();
          return prev;
        }

        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          lastMessage: {
            id: data.lastMessage.id,
            message: data.lastMessage.message,
            senderId: data.lastMessage.senderId,
            senderName: data.lastMessage.senderName,
            createdAt: data.lastMessage.createdAt,
          },
          updatedAt: data.updatedAt,
        };

        updated.sort((a, b) => {
          const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return timeB - timeA;
        });

        return updated;
      });
    };

    socket.on("conversationUpdated", handleConversationUpdated);

    return () => {
      socket.off("conversationUpdated", handleConversationUpdated);
    };
  }, [socket]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedSearch.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearchingUsers(true);
      try {
        const users = await searchUsers(debouncedSearch.trim(), 20);
        setSearchResults(users);
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      } finally {
        setIsSearchingUsers(false);
      }
    };

    fetchUsers();
  }, [debouncedSearch]);

  const isSearching = debouncedSearch.trim().length > 0;

  return (
    <div className="w-80 border-r border-border bg-background flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            type="text"
            placeholder="Search friends..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {isSearching ? (
            <>
              {isSearchingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                      "hover:bg-muted/50",
                      creatingConversation === user.id &&
                        "opacity-50 pointer-events-none",
                    )}
                  >
                    <div className="relative">
                      <Avatar className="size-12">
                        <AvatarImage
                          src={user.avatar || undefined}
                          alt={user.name}
                        />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "absolute bottom-0 right-0 size-3 rounded-full border-2 border-background",
                          isSearchUserOnline(user.id)
                            ? "bg-green"
                            : "bg-destructive",
                        )}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {user.name}
                      </h3>
                      {creatingConversation === user.id && (
                        <p className="text-xs text-muted-foreground">
                          Opening...
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No users found
                  </p>
                </div>
              )}
            </>
          ) : isLoadingConversations ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">
                Loading conversations...
              </p>
            </div>
          ) : conversations.length > 0 ? (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationClick(conversation)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                  "hover:bg-muted/50",
                )}
              >
                <div className="relative">
                  <Avatar className="size-12">
                    <AvatarImage
                      src={conversation.avatar || undefined}
                      alt={conversation.name}
                    />
                    <AvatarFallback>
                      {conversation.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {!conversation.isGroup && conversation.otherUser && (
                    <div
                      className={cn(
                        "absolute bottom-0 right-0 size-3 rounded-full border-2 border-background",
                        isConversationUserOnline(conversation.otherUser.id)
                          ? "bg-green"
                          : "bg-destructive",
                      )}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-medium text-sm truncate">
                      {conversation.name}
                    </h3>
                    {conversation.lastMessage?.createdAt && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatTimeAgo(conversation.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage?.message || "No messages yet"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">
                No conversations yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
