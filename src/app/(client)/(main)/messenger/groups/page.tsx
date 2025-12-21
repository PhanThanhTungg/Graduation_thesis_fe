"use client";

import { useEffect, useState } from "react";
import { getMyGroups } from "@/service/course.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatTimeAgo } from "@/lib/helpers";
import { CreateGroupDialog } from "./_components/create-group-dialog";

type GroupType = {
  id: string;
  name: string;
  isGroup: boolean;
  role: "admin" | "subadmin" | "member";
  memberCount: number;
  createdAt: string;
  updatedAt: string | null;
  course?: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
  };
  lastMessage?: {
    id: string;
    message: string | null;
    senderId: string;
    senderName: string;
    createdAt: string;
  };
};

export default function GroupsPage() {
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const data = await getMyGroups();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Group Conversations</h1>
          <p className="text-muted-foreground">Manage your group chats</p>
        </div>
        <CreateGroupDialog onGroupCreated={fetchGroups} />
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading groups...</p>
          </div>
        ) : groups.length > 0 ? (
          <div className="space-y-2">
            {groups.map((group) => (
              <Link
                key={group.id}
                href={`/messenger/groups/${group.id}`}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-colors",
                  "hover:bg-muted/50 border border-border",
                )}
              >
                <Avatar className="size-14">
                  {group.course?.thumbnailUrl ? (
                    <AvatarImage
                      src={group.course.thumbnailUrl}
                      alt={group.name}
                    />
                  ) : null}
                  <AvatarFallback>
                    {group.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-base truncate">
                      {group.name}
                    </h3>
                    {group.lastMessage?.createdAt && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatTimeAgo(group.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  {group.course && (
                    <p className="text-sm text-muted-foreground mb-1">
                      Course: {group.course.title}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground truncate">
                      {group.lastMessage
                        ? `${group.lastMessage.senderName}: ${group.lastMessage.message || ""}`
                        : "No messages yet"}
                    </p>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {group.memberCount}{" "}
                      {group.memberCount === 1 ? "member" : "members"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-muted-foreground">
                No group conversations yet. Join a course to get started!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
