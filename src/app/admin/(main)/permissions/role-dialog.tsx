"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import {
  AdminRoleWithPermissions,
  AdminPermission,
  formatPermissionObject,
  formatPermissionAction,
} from "@/lib/admin-permissions-mock-data";
import {
  createRole,
  updateRole,
  CreateRoleInput,
  UpdateRoleInput,
} from "@/service/admin/role-permission.service";

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: AdminRoleWithPermissions;
  permissions: AdminPermission[];
  mode: "create" | "edit";
}

export function RoleDialog({
  open,
  onOpenChange,
  role,
  permissions,
  mode,
}: RoleDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: role?.title || "",
    description: role?.description || "",
    permissionIds: role?.permissions.map((p) => p.adminPermissionId) || [],
  });

  React.useEffect(() => {
    if (role) {
      setFormData({
        title: role.title || "",
        description: role.description || "",
        permissionIds: role.permissions.map((p) => p.adminPermissionId),
      });
    } else {
      setFormData({ title: "", description: "", permissionIds: [] });
    }
  }, [role, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        const result = await createRole(formData as CreateRoleInput);
        if (result.success) {
          showToast("success", result.message || "Role created successfully");
          onOpenChange(false);
          router.refresh();
        } else {
          showToast("error", result.message || "Failed to create role");
        }
      } else if (role) {
        const updateData: UpdateRoleInput = {};
        if (formData.title !== role.title) updateData.title = formData.title;
        if (formData.description !== role.description)
          updateData.description = formData.description;

        const currentPermissionIds = role.permissions
          .map((p) => p.adminPermissionId)
          .sort();
        const newPermissionIds = formData.permissionIds.sort();
        if (
          JSON.stringify(currentPermissionIds) !==
          JSON.stringify(newPermissionIds)
        ) {
          updateData.permissionIds = formData.permissionIds;
        }

        const result = await updateRole(role.id, updateData);
        if (result.success) {
          showToast("success", result.message || "Role updated successfully");
          onOpenChange(false);
          router.refresh();
        } else {
          showToast("error", result.message || "Failed to update role");
        }
      }
    } catch (error) {
      showToast("error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter((id) => id !== permissionId)
        : [...prev.permissionIds, permissionId],
    }));
  };

  // Group permissions by object
  const groupedPermissions = React.useMemo(() => {
    const groups = new Map<string, AdminPermission[]>();
    permissions.forEach((perm) => {
      if (!groups.has(perm.object)) {
        groups.set(perm.object, []);
      }
      groups.get(perm.object)?.push(perm);
    });
    return groups;
  }, [permissions]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Role" : "Edit Role"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new role and assign permissions"
              : "Update role details and permissions"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Role Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Content Manager"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of this role"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions *</Label>
              <div className="border rounded-md p-4 space-y-4 max-h-[400px] overflow-y-auto">
                {Array.from(groupedPermissions.entries()).map(
                  ([object, perms]) => (
                    <div key={object} className="space-y-2">
                      <h4 className="font-semibold text-sm">
                        {formatPermissionObject(object)}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 ml-4">
                        {perms.map((perm) => (
                          <div
                            key={perm.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={perm.id}
                              checked={formData.permissionIds.includes(perm.id)}
                              onCheckedChange={() =>
                                handlePermissionToggle(perm.id)
                              }
                            />
                            <label
                              htmlFor={perm.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {formatPermissionAction(perm.action)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
              {formData.permissionIds.length === 0 && (
                <p className="text-sm text-destructive">
                  Please select at least one permission
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                !formData.title ||
                formData.permissionIds.length === 0
              }
            >
              {loading
                ? "Saving..."
                : mode === "create"
                  ? "Create Role"
                  : "Update Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
