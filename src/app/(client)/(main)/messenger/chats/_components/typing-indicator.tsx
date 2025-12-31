"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  userName: string;
  userAvatar: string | null;
}

export function TypingIndicator({
  userName,
  userAvatar,
}: TypingIndicatorProps) {
  return (
    <div className={cn("flex gap-3 justify-start")}>
      <Avatar className="size-8 shrink-0">
        <AvatarImage src={userAvatar || undefined} />
        <AvatarFallback>
          {userName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col max-w-[70%] items-start">
        <div className="bg-muted rounded-lg px-4 py-2">
          <div className="flex gap-1">
            <span className="size-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="size-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="size-2 bg-muted-foreground rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
