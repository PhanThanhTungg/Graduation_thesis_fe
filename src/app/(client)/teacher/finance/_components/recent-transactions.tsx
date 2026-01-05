"use client";

import { useState, useEffect, useCallback } from "react";
import { getTransactions } from "@/service/finance.service";
import { formatPrice } from "@/lib/utils";
import { formatDate } from "@/lib/helpers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { showToast } from "@/lib/toast";

type Transaction = {
  id: string;
  walletId: string;
  type: "deposit" | "withdrawal" | "order" | "disk";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  description: string | null;
  createdAt: string;
};

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortField, setSortField] = useState<"amount" | "createdAt">(
    "createdAt",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTransactions({
        page,
        limit,
        sortField,
        sortOrder,
        type:
          typeFilter === "all"
            ? undefined
            : (typeFilter as "deposit" | "withdrawal" | "order" | "disk"),
        status:
          statusFilter === "all"
            ? undefined
            : (statusFilter as
                | "pending"
                | "processing"
                | "completed"
                | "cancelled"),
      });

      setTransactions(data.transactions);
      if (data.pagination) {
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      showToast("error", "Failed to fetch transactions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortField, sortOrder, typeFilter, statusFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green";
      case "processing":
        return "text-yellow";
      case "pending":
        return "text-orange";
      case "cancelled":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    const color = getStatusColor(status);
    return <span className={`capitalize ${color} font-medium`}>{status}</span>;
  };

  const hasActiveFilters = typeFilter !== "all" || statusFilter !== "all";

  const handleClearFilters = () => {
    setTypeFilter("all");
    setStatusFilter("all");
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");
    setSortField(field as "amount" | "createdAt");
    setSortOrder(order as "asc" | "desc");
    setPage(1);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your transaction history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 items-center mb-6">
          <Select value={typeFilter} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="withdrawal">Withdrawal</SelectItem>
              <SelectItem value="order">Order</SelectItem>
              <SelectItem value="disk">Disk Space</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={`${sortField}-${sortOrder}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              <SelectItem value="amount-desc">Amount (High-Low)</SelectItem>
              <SelectItem value="amount-asc">Amount (Low-High)</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="gap-2"
            >
              <X className="size-4" />
              Clear
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading...
          </div>
        ) : transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="capitalize">
                    {transaction.type}
                  </TableCell>
                  <TableCell
                    className={
                      transaction.type === "deposit" ||
                      transaction.type === "order"
                        ? "text-green font-medium"
                        : "text-orange font-medium"
                    }
                  >
                    {transaction.type === "deposit" ||
                    transaction.type === "order"
                      ? "+"
                      : "-"}
                    {formatPrice(Math.abs(transaction.amount))}
                  </TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(transaction.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found
          </div>
        )}

        {total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Items per page:</span>
              <Select
                value={limit.toString()}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="ml-4">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, total)} of {total}
              </span>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Previous</span>
                </Button>
                <div className="px-4 text-sm font-medium">
                  Page {page} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                >
                  <span className="hidden sm:inline mr-2">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
