"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, UserX } from "lucide-react";
import {
  getConversationMembers,
  removeMember,
  type ConversationMember,
} from "@/service/chat.service";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { formatTimeAgo } from "@/lib/helpers";

interface GroupMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  currentUserId: string;
  onMemberRemoved?: () => void;
}

export function GroupMembersDialog({
  open,
  onOpenChange,
  conversationId,
  currentUserId,
  onMemberRemoved,
}: GroupMembersDialogProps) {
  const [members, setMembers] = useState<ConversationMember[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<
    "admin" | "subadmin" | "member" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{
    userId: string;
    userName: string;
  } | null>(null);

  useEffect(() => {
    if (open) {
      fetchMembers();
    } else {
      setMembers([]);
      setCurrentUserRole(null);
    }
  }, [open, conversationId]);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const data = await getConversationMembers(conversationId);
      setMembers(data.members);
      setCurrentUserRole(data.currentUserRole);
    } catch (error) {
      console.error("Error fetching members:", error);
      showToast("error", "Failed to load members");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveClick = (userId: string, userName: string) => {
    setMemberToRemove({ userId, userName });
    setConfirmRemoveOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return;

    setConfirmRemoveOpen(false);
    setRemovingUserId(memberToRemove.userId);
    try {
      await removeMember(conversationId, memberToRemove.userId);
      showToast("success", "Member removed successfully");
      setMembers((prev) =>
        prev.filter((m) => m.userId !== memberToRemove.userId),
      );
      if (onMemberRemoved) {
        onMemberRemoved();
      }
    } catch (error) {
      console.error("Error removing member:", error);
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to remove member",
      );
    } finally {
      setRemovingUserId(null);
      setMemberToRemove(null);
    }
  };

  const isAdmin = currentUserRole === "admin";
  const sortedMembers = [...members].sort((a, b) => {
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    return a.user.name.localeCompare(b.user.name);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Group Members</DialogTitle>
          <DialogDescription>
            Manage members of this group conversation
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : sortedMembers.length > 0 ? (
            <div className="space-y-2">
              {sortedMembers.map((member) => {
                const isCurrentUser = member.userId === currentUserId;
                const canRemove =
                  isAdmin && !isCurrentUser && member.role !== "admin";
                return (
                  <div
                    key={member.userId}
                    className={cn(
                      "flex items-center justify-between gap-3 p-3 rounded-lg",
                      isCurrentUser && "bg-muted/50",
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="size-10">
                        <AvatarImage src={member.user.avatar || undefined} />
                        <AvatarFallback>
                          {member.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">
                            {member.user.name}
                            {isCurrentUser && " (You)"}
                          </p>
                          {member.role === "admin" && (
                            <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Joined {formatTimeAgo(member.joinedAt)}
                        </p>
                      </div>
                    </div>
                    {canRemove && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleRemoveClick(member.userId, member.user.name)
                        }
                        disabled={removingUserId === member.userId}
                        className="shrink-0"
                      >
                        {removingUserId === member.userId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UserX className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No members found
            </div>
          )}
        </div>
      </DialogContent>

      <Dialog open={confirmRemoveOpen} onOpenChange={setConfirmRemoveOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold">{memberToRemove?.userName}</span>{" "}
              from this group?
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmRemoveOpen(false);
                setMemberToRemove(null);
              }}
              disabled={!!removingUserId}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRemove}
              disabled={!!removingUserId}
            >
              {removingUserId && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
