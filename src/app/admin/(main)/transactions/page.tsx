"use client";

import { useCallback, useState } from "react";
import { TransactionsDataTable } from "./listTransactions";
import {
  getTransactions,
  TransactionListItem,
  TransactionType,
  TransactionStatus,
} from "@/lib/admin-transactions-mock-data";

export default function TransactionsPage() {
  const [transactions] = useState<TransactionListItem[]>(() =>
    getTransactions(),
  );
  const [pagination] = useState({
    page: 1,
    limit: 10,
    total: 50,
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

  const handleTypeFilterChange = useCallback(
    (type: TransactionType | "all") => {
      console.log("Type filter changed:", type);
    },
    [],
  );

  const handleStatusFilterChange = useCallback(
    (status: TransactionStatus | "all") => {
      console.log("Status filter changed:", status);
    },
    [],
  );

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Transactions Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all user transactions
        </p>
      </div>
      <TransactionsDataTable
        data={transactions}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onTypeFilterChange={handleTypeFilterChange}
        onStatusFilterChange={handleStatusFilterChange}
      />
    </div>
  );
}
