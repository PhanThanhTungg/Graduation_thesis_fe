"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { deleteAdminAccount } from "@/service/admin/admin-account.service";
import { useState } from "react";

interface DeleteAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adminId: string;
  adminName: string;
  onSuccess: () => void;
}

export function DeleteAdminDialog({
  open,
  onOpenChange,
  adminId,
  adminName,
  onSuccess,
}: DeleteAdminDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteAdminAccount(adminId);
    if (result) {
      onOpenChange(false);
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Admin Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the admin account for{" "}
            <span className="font-semibold">{adminName}</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
