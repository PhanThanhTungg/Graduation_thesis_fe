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
import { useRouter } from "next/navigation";
import { deleteRole } from "@/service/admin/role-permission.service";
import { useState } from "react";

interface DeleteRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleId: string;
  roleTitle: string;
}

export function DeleteRoleDialog({
  open,
  onOpenChange,
  roleId,
  roleTitle,
}: DeleteRoleDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteRole(roleId);
      if (result.success) {
        showToast("success", result.message || "Role deleted successfully");
        onOpenChange(false);
        router.refresh();
      } else {
        showToast("error", result.message || "Failed to delete role");
      }
    } catch (error) {
      showToast("error", "An error occurred while deleting the role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Role</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the role{" "}
            <strong>{roleTitle}</strong>? This action cannot be undone.
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
