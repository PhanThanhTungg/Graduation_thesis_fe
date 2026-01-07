"use client";

import { useCallback, useState, useEffect } from "react";
import { PaymentsDataTable } from "./listPayments";
import {
  getWithdrawals,
  PaymentListItem,
  PaymentStatus,
  GetWithdrawalsParams,
} from "@/service/admin/finance.service";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { AlertCircle } from "lucide-react";

export default function PaymentsPage() {
  const { hasPermission, isLoading: isCheckingPermission } =
    useAdminPermissions();
  const [payments, setPayments] = useState<PaymentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "all" as PaymentStatus | "all",
    sortField: "createdAt" as "amount" | "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });

  const hasAccess = hasPermission("payment", "view");

  useEffect(() => {
    if (isCheckingPermission || !hasAccess) return;

    const fetchWithdrawals = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params: GetWithdrawalsParams = {
          page: pagination.page,
          limit: pagination.limit,
          sortField: filters.sortField,
          sortOrder: filters.sortOrder,
        };

        if (filters.search) {
          params.keySearch = filters.search;
        }

        if (filters.status !== "all") {
          params.status = filters.status;
        }

        const data = await getWithdrawals(params);
        setPayments(data.withdrawals);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch withdrawals",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchWithdrawals();
  }, [
    isCheckingPermission,
    hasAccess,
    pagination.page,
    pagination.limit,
    filters.search,
    filters.status,
    filters.sortField,
    filters.sortOrder,
  ]);

  const handlePaginationChange = useCallback((page: number, limit: number) => {
    setPagination((prev) => ({ ...prev, page, limit }));
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleSortChange = useCallback(
    (sortField: string, sortOrder: "asc" | "desc") => {
      setFilters((prev) => ({
        ...prev,
        sortField: sortField as "amount" | "createdAt",
        sortOrder: sortOrder as "asc" | "desc",
      }));
    },
    [],
  );

  const handleStatusFilterChange = useCallback(
    (status: PaymentStatus | "all") => {
      setFilters((prev) => ({ ...prev, status }));
      setPagination((prev) => ({ ...prev, page: 1 }));
    },
    [],
  );

  if (isCheckingPermission || isLoading) {
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold">Error</h3>
          <p className="text-muted-foreground">{error}</p>
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
