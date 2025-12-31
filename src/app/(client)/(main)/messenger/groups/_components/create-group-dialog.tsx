"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Loader2 } from "lucide-react";
import { createGroup } from "@/service/chat.service";
import { getAcceptedFriends } from "@/friends/client/friends.service";
import { AcceptedFriend } from "@/schema/friend.schema";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateGroupDialogProps {
  onGroupCreated?: () => void;
}

export function CreateGroupDialog({ onGroupCreated }: CreateGroupDialogProps) {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [friends, setFriends] = useState<AcceptedFriend[]>([]);
  const [selectedFriendIds, setSelectedFriendIds] = useState<Set<string>>(
    new Set(),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);

  const fetchFriends = async () => {
    setIsLoadingFriends(true);
    try {
      const friendsData = await getAcceptedFriends();
      setFriends(friendsData);
    } catch (error) {
      console.error("Error fetching friends:", error);
      showToast("error", "Failed to load friends");
    } finally {
      setIsLoadingFriends(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchFriends();
    } else {
      setGroupName("");
      setSelectedFriendIds(new Set());
    }
  }, [open]);

  const handleFriendToggle = useCallback((friendId: string) => {
    setSelectedFriendIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(friendId)) {
        newSet.delete(friendId);
      } else {
        newSet.add(friendId);
      }
      return newSet;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) {
      showToast("error", "Please enter a group name");
      return;
    }

    if (groupName.trim().length > 50) {
      showToast("error", "Group name must be less than 50 characters");
      return;
    }

    if (selectedFriendIds.size === 0) {
      showToast("error", "Please select at least one friend");
      return;
    }

    setIsLoading(true);
    try {
      await createGroup(groupName.trim(), Array.from(selectedFriendIds));
      showToast("success", "Group created successfully");
      setOpen(false);
      if (onGroupCreated) {
        onGroupCreated();
      }
    } catch (error) {
      console.error("Error creating group:", error);
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to create group",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Group
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a group chat with your friends
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              maxLength={50}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {groupName.length}/50 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label>Select Friends</Label>
            <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-2">
              {isLoadingFriends ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : friends.length > 0 ? (
                friends.map((friend) => {
                  const isSelected = selectedFriendIds.has(friend.id);
                  const friendId = friend.id;
                  return (
                    <label
                      key={friendId}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted/50",
                        isSelected && "bg-muted",
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleFriendToggle(friendId)}
                      />
                      <Avatar className="size-8">
                        <AvatarImage src={friend.avatar || undefined} />
                        <AvatarFallback>
                          {friend.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium flex-1">
                        {friend.name}
                      </span>
                    </label>
                  );
                })
              ) : (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No friends available
                </div>
              )}
            </div>
            {selectedFriendIds.size > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedFriendIds.size}{" "}
                {selectedFriendIds.size === 1 ? "friend" : "friends"} selected
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Group
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
