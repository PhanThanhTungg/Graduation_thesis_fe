"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConversationType, MessageType } from "@/schema/chat.schema";
import { sendMessage, getMessages } from "@/service/chat.service";
import { showToast } from "@/lib/toast";
import { getMyProfile } from "@/service/user.service";
import { UserType } from "@/schema/user.schema";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/helpers";

interface ChatViewProps {
  conversation: ConversationType;
}

export function ChatView({ conversation }: ChatViewProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingMessages(true);
      try {
        const [messagesData, userData] = await Promise.all([
          getMessages(conversation.id),
          getMyProfile(),
        ]);
        setMessages(messagesData);
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("error", "Failed to load messages");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchData();
  }, [conversation.id]);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    const messageText = message.trim();
    setMessage("");
    setIsSending(true);
    try {
      const newMessage = await sendMessage(conversation.id, messageText);
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      showToast("error", "Failed to send message");
      setMessage(messageText);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={conversation.otherUser.avatar || undefined} />
            <AvatarFallback>
              {conversation.otherUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{conversation.otherUser.name}</h2>
            <p className="text-sm text-muted-foreground">Active now</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground">
                Start a conversation with {conversation.otherUser.name}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => {
              const isMyMessage =
                currentUser && msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3",
                    isMyMessage ? "justify-end" : "justify-start",
                  )}
                >
                  {!isMyMessage && (
                    <Avatar className="size-8 shrink-0">
                      <AvatarImage src={msg.sender.avatar || undefined} />
                      <AvatarFallback>
                        {msg.sender.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "flex flex-col max-w-[70%]",
                      isMyMessage ? "items-end" : "items-start",
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2",
                        isMyMessage
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                  {isMyMessage && (
                    <Avatar className="size-8 shrink-0">
                      <AvatarImage src={currentUser?.avatarUrl || undefined} />
                      <AvatarFallback>
                        {currentUser?.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            size="icon"
          >
            <Send className="size-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
