"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { searchUsers } from "@/service/user.service";
import { SearchedUser } from "@/schema/user.schema";
import { createOrGetConversation } from "@/service/chat.service";
import { ConversationType } from "@/schema/chat.schema";
import { showToast } from "@/lib/toast";

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

const mockChats: ChatUser[] = [
  {
    id: "1",
    name: "John Doe",
    lastMessage: "Hey, how are you?",
    lastMessageTime: "2m",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    lastMessage: "See you tomorrow!",
    lastMessageTime: "1h",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "3",
    name: "Mike Johnson",
    lastMessage: "Thanks for the help!",
    lastMessageTime: "3h",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "4",
    name: "Sarah Williams",
    lastMessage: "Are you free this weekend?",
    lastMessageTime: "1d",
    unreadCount: 1,
    isOnline: false,
  },
];

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
    } catch (error) {
      console.error("Error creating conversation:", error);
      showToast("error", "Failed to create conversation");
    } finally {
      setCreatingConversation(null);
    }
  };

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
          ) : (
            mockChats.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                  "hover:bg-muted/50",
                )}
              >
                <div className="relative">
                  <Avatar className="size-12">
                    <AvatarImage src={chat.avatar} alt={chat.name} />
                    <AvatarFallback>
                      {chat.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-medium text-sm truncate">
                      {chat.name}
                    </h3>
                    {chat.lastMessageTime && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        {chat.lastMessageTime}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.unreadCount && chat.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs font-medium rounded-full size-5 flex items-center justify-center shrink-0">
                        {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
