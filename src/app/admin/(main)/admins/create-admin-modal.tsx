"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminListItem } from "@/lib/admin-admins-mock-data";

interface CreateAdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (admin: AdminListItem) => void;
}

const roles = [
  { id: "1", title: "Super Admin" },
  { id: "2", title: "Content Manager" },
  { id: "3", title: "User Manager" },
  { id: "4", title: "Viewer" },
];

export function CreateAdminModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateAdminModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!fullName.trim() || !email.trim() || !selectedRoleId) {
      return;
    }

    setIsSubmitting(true);

    const selectedRole = roles.find((r) => r.id === selectedRoleId);
    const newAdmin: AdminListItem = {
      id: Date.now().toString(),
      fullName: fullName.trim(),
      email: email.trim(),
      role: {
        id: selectedRoleId,
        title: selectedRole?.title || null,
      },
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    setTimeout(() => {
      onSuccess(newAdmin);
      setFullName("");
      setEmail("");
      setSelectedRoleId("");
      setIsSubmitting(false);
      onOpenChange(false);
    }, 500);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFullName("");
      setEmail("");
      setSelectedRoleId("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Admin</DialogTitle>
          <DialogDescription>
            Add a new administrator to the system. Fill in the required
            information below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">
              Role <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedRoleId}
              onValueChange={setSelectedRoleId}
              disabled={isSubmitting}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !fullName.trim() ||
              !email.trim() ||
              !selectedRoleId
            }
          >
            {isSubmitting ? "Creating..." : "Create Admin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
