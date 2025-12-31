"use client";

import { useCallback, useState } from "react";
import { PaymentsDataTable } from "./listPayments";
import {
  getPayments,
  PaymentListItem,
  PaymentStatus,
} from "@/lib/admin-payments-mock-data";

export default function PaymentsPage() {
  const [payments] = useState<PaymentListItem[]>(() => getPayments());
  const [pagination] = useState({
    page: 1,
    limit: 10,
    total: 45,
    totalPages: 5,
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

  const handleStatusFilterChange = useCallback(
    (status: PaymentStatus | "all") => {
      console.log("Status filter changed:", status);
    },
    [],
  );

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
