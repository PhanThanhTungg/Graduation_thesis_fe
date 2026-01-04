"use client";

import { useCallback, useState, useEffect } from "react";
import { PaymentsDataTable } from "./listPayments";
import {
  getPayments,
  PaymentListItem,
  PaymentStatus,
} from "@/lib/admin-payments-mock-data";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { AlertCircle } from "lucide-react";

export default function PaymentsPage() {
  const { hasPermission, isLoading: isCheckingPermission } =
    useAdminPermissions();
  const [payments, setPayments] = useState<PaymentListItem[]>([]);
  const [pagination] = useState({
    page: 1,
    limit: 10,
    total: 45,
    totalPages: 5,
  });

  const hasAccess = hasPermission("payment", "view");

  useEffect(() => {
    if (!isCheckingPermission && hasAccess) {
      setPayments(getPayments());
    }
  }, [isCheckingPermission, hasAccess]);

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

  const handleStatusFilterChange = useCallback(
    (status: PaymentStatus | "all") => {
      console.log("Status filter changed:", status);
    },
    [],
  );

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
        <h1 className="text-3xl font-bold">Payments Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage teacher withdrawal requests
        </p>
      </div>
      <PaymentsDataTable
        data={payments}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onStatusFilterChange={handleStatusFilterChange}
      />
    </div>
  );
}
