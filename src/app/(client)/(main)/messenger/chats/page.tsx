"use client";

import { useState } from "react";
import { ChatSidebar } from "./_components/chat-sidebar";
import { ChatView } from "./_components/chat-view";
import { ConversationType } from "@/schema/chat.schema";

export default function ChatsPage() {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationType | null>(null);

  return (
    <div className="flex h-full">
      <ChatSidebar onConversationSelect={setSelectedConversation} />
      <div className="flex-1 flex items-center justify-center border-l border-border">
        {selectedConversation ? (
          <ChatView conversation={selectedConversation} />
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">
              Select a conversation to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
