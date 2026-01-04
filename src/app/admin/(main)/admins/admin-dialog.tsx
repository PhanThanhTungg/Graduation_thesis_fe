"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/lib/toast";
import {
  AdminAccount,
  CreateAdminInput,
  UpdateAdminInput,
  createAdminSchema,
  updateAdminSchema,
} from "@/schema/admin.schema";
import {
  createAdminAccount,
  updateAdminAccount,
} from "@/service/admin/admin-account.service";

interface AdminRole {
  id: string;
  title: string;
}

interface AdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin?: AdminAccount;
  roles: AdminRole[];
  mode: "create" | "edit";
  onSuccess: () => void;
}

export function AdminDialog({
  open,
  onOpenChange,
  admin,
  roles,
  mode,
  onSuccess,
}: AdminDialogProps) {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<CreateAdminInput | UpdateAdminInput>({
    resolver: zodResolver(
      mode === "create" ? createAdminSchema : updateAdminSchema,
    ),
    mode: "onChange",
    defaultValues:
      mode === "create"
        ? {
            fullName: "",
            email: "",
            password: "",
            roleId: "",
          }
        : {
            fullName: admin?.fullName || "",
            email: admin?.email || "",
            roleId: admin?.adminRoleId || "",
          },
  });

  React.useEffect(() => {
    if (open) {
      if (mode === "create") {
        form.reset({
          fullName: "",
          email: "",
          password: "",
          roleId: "",
        });
      } else if (admin) {
        form.reset({
          fullName: admin.fullName,
          email: admin.email,
          roleId: admin.adminRoleId,
        });
      }
    }
  }, [open, admin, mode, form]);

  const onSubmit = async (data: CreateAdminInput | UpdateAdminInput) => {
    setLoading(true);

    if (mode === "create") {
      const result = await createAdminAccount(data as CreateAdminInput);
      if (result) {
        showToast("success", "Admin account created successfully");
        onOpenChange(false);
        onSuccess();
      }
    } else if (admin) {
      const updateData: UpdateAdminInput = {};
      const formData = data as UpdateAdminInput;

      if (formData.fullName && formData.fullName !== admin.fullName) {
        updateData.fullName = formData.fullName;
      }
      if (formData.email && formData.email !== admin.email) {
        updateData.email = formData.email;
      }
      if (formData.roleId && formData.roleId !== admin.adminRoleId) {
        updateData.roleId = formData.roleId;
      }

      if (Object.keys(updateData).length === 0) {
        showToast("info", "No changes to update");
        onOpenChange(false);
        setLoading(false);
        return;
      }

      const result = await updateAdminAccount(admin.id, updateData);
      if (result) {
        showToast("success", "Admin account updated successfully");
        onOpenChange(false);
        onSuccess();
      }
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Admin" : "Edit Admin"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new admin account"
              : "Update admin account details"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === "create" && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Must contain at least 1 lowercase, 1 uppercase, 1 number
                      and 1 special character
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                    ? "Create"
                    : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
