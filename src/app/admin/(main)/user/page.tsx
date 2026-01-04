"use client";

import { useCallback, useEffect, useState } from "react";
import { UserDataTable } from "./listUsers";
import {
  getAllUsers,
  GetAllUsersParams,
  UserListItem,
  updateUserStatus,
} from "@/service/admin/user.service";
import { toast } from "sonner";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { AlertCircle } from "lucide-react";

export default function UserPage() {
  const { hasPermission, isLoading: isCheckingPermission } =
    useAdminPermissions();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<GetAllUsersParams>({
    page: 1,
    limit: 10,
    sortField: "createdAt",
    sortOrder: "desc",
  });

  const hasAccess = hasPermission("user", "view");

  const fetchUsers = useCallback(async () => {
    if (!hasAccess) return;

    setIsLoading(true);
    try {
      const data = await getAllUsers(filters);
      setUsers(data.items);
      setPagination(data.pagination);
    } catch {
      toast.error("An error occurred while fetching users");
    } finally {
      setIsLoading(false);
    }
  }, [filters, hasAccess]);

  useEffect(() => {
    if (!isCheckingPermission && hasAccess) {
      fetchUsers();
    }
  }, [fetchUsers, isCheckingPermission, hasAccess]);

  const handlePaginationChange = (page: number, limit: number) => {
    setFilters((prev) => ({ ...prev, page, limit }));
  };

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({
      ...prev,
      keySearch: search || undefined,
      page: 1,
    }));
  };

  const handleSortChange = (sortField: string, sortOrder: "asc" | "desc") => {
    setFilters((prev) => ({ ...prev, sortField, sortOrder }));
  };

  const handleRoleFilterChange = (role: "teacher" | "student" | "all") => {
    setFilters((prev) => ({
      ...prev,
      role: role === "all" ? undefined : role,
      page: 1,
    }));
  };

  const handleStatusChange = async (
    userId: string,
    status: "active" | "inactive" | "banned",
  ) => {
    try {
      await updateUserStatus(userId, status);
      toast.success("User status updated successfully");
      // Update local state
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, status } : user)),
      );
    } catch {
      toast.error("An error occurred while updating user status");
    }
  };

  if (isCheckingPermission) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold">Access Denied</h3>
          <p className="text-muted-foreground">
            You do not have permission to view this content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage all users in the system
        </p>
      </div>
      <UserDataTable
        data={users}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onRoleFilterChange={handleRoleFilterChange}
        onStatusChange={handleStatusChange}
        isLoading={isLoading}
      />
    </div>
  );
}
