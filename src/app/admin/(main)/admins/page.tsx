"use client";

import { useCallback, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { AdminsDataTable } from "./listAdmins";
import { CreateAdminModal } from "./create-admin-modal";
import { getAdmins, AdminListItem } from "@/lib/admin-admins-mock-data";
import { Button } from "@/components/ui/button";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminListItem[]>(() => getAdmins());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 4,
    totalPages: 1,
  });

  const handlePaginationChange = useCallback((page: number, limit: number) => {
    console.log("Pagination changed:", { page, limit });
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    console.log("Search changed:", search);
  }, []);

  const handleSortChange = useCallback(
    (sortField: string, sortOrder: "asc" | "desc") => {
      console.log("Sort changed:", { sortField, sortOrder });
    },
    [],
  );

  const handleCreateAdmin = useCallback((newAdmin: AdminListItem) => {
    setAdmins((prev) => [newAdmin, ...prev]);
    setPagination((prev) => ({
      ...prev,
      total: prev.total + 1,
      totalPages: Math.ceil((prev.total + 1) / prev.limit),
    }));
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage all administrators in the system
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <IconPlus className="mr-2 h-4 w-4" />
          Create New Admin
        </Button>
      </div>
      <AdminsDataTable
        data={admins}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
      />
      <CreateAdminModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleCreateAdmin}
      />
    </div>
  );
}
