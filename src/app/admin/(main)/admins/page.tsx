"use client";

import { useState, useEffect } from "react";
import { getAllAdminAccounts } from "@/service/admin/admin-account.service";
import { getAdminRolesWithPermissions } from "@/service/admin/role-permission.service";
import { AdminsDataTable } from "./data-table";
import { AdminDialog } from "./admin-dialog";
import { DeleteAdminDialog } from "./delete-admin-dialog";
import { AdminAccount } from "@/schema/admin.schema";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { AlertCircle } from "lucide-react";

interface AdminRole {
  id: string;
  title: string;
}

export default function AdminAccountPage() {
  const { hasPermission, isLoading: isCheckingPermission } =
    useAdminPermissions();
  const [data, setData] = useState<AdminAccount[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAccount | null>(null);

  const hasAccess = hasPermission("admin", "view");

  const fetchData = async () => {
    if (!hasAccess) return; // Don't fetch if no access

    setIsLoading(true);
    const response = await getAllAdminAccounts({
      page: pagination.page,
      limit: pagination.limit,
      keySearch: searchQuery || undefined,
      sortField,
      sortOrder,
    });

    setData(response.items);
    setPagination(response.pagination);
    setIsLoading(false);
  };

  const fetchRoles = async () => {
    if (!hasAccess) return; // Don't fetch if no access

    const rolesData = await getAdminRolesWithPermissions();
    const formattedRoles = rolesData.map((role) => ({
      id: role.id,
      title: role.title || "",
    }));
    setRoles(formattedRoles);
  };

  useEffect(() => {
    if (!isCheckingPermission && hasAccess) {
      fetchRoles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheckingPermission, hasAccess]);

  useEffect(() => {
    if (!isCheckingPermission && hasAccess) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination.page,
    pagination.limit,
    searchQuery,
    sortField,
    sortOrder,
    isCheckingPermission,
    hasAccess,
  ]);

  const handlePaginationChange = (page: number, limit: number) => {
    setPagination((prev) => ({ ...prev, page, limit }));
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (field: string, order: "asc" | "desc") => {
    setSortField(field);
    setSortOrder(order);
  };

  const handleCreateClick = () => {
    setSelectedAdmin(null);
    setCreateDialogOpen(true);
  };

  const handleEditClick = (admin: AdminAccount) => {
    setSelectedAdmin(admin);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (admin: AdminAccount) => {
    setSelectedAdmin(admin);
    setDeleteDialogOpen(true);
  };

  const handleSuccess = () => {
    fetchData();
  };

  // Show loading while checking permission
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

  // Show access denied if no permission
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage all administrators in the system
          </p>
        </div>
      </div>

      <AdminsDataTable
        data={data}
        roles={roles}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onCreateClick={handleCreateClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        isLoading={isLoading}
      />

      <AdminDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        roles={roles}
        mode="create"
        onSuccess={handleSuccess}
      />

      <AdminDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        admin={selectedAdmin || undefined}
        roles={roles}
        mode="edit"
        onSuccess={handleSuccess}
      />

      <DeleteAdminDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        adminId={selectedAdmin?.id || ""}
        adminName={selectedAdmin?.fullName || ""}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
