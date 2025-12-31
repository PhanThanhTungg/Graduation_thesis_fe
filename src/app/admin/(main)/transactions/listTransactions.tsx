"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconSearch,
  IconX,
  IconArrowDown,
  IconArrowUp,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  TransactionListItem,
  TransactionType,
  TransactionStatus,
} from "@/lib/admin-transactions-mock-data";

type TransactionsDataTableProps = {
  data: TransactionListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPaginationChange: (page: number, limit: number) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sortField: string, sortOrder: "asc" | "desc") => void;
  onTypeFilterChange: (type: TransactionType | "all") => void;
  onStatusFilterChange: (status: TransactionStatus | "all") => void;
};

const getStatusColor = (status: TransactionStatus) => {
  const colors: Record<TransactionStatus, string> = {
    completed: "bg-green-foreground text-primary-foreground",
    processing: "bg-yellow text-primary-foreground",
    pending: "bg-chart-2 text-primary-foreground",
    cancelled: "bg-destructive text-primary-foreground",
  };
  return colors[status] || "bg-muted text-muted-foreground";
};

const getTypeColor = (type: TransactionType) => {
  const colors: Record<TransactionType, string> = {
    deposit: "bg-green-foreground text-primary-foreground",
    withdrawal: "bg-orange text-primary-foreground",
  };
  return colors[type] || "bg-muted text-muted-foreground";
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

export function TransactionsDataTable({
  data,
  pagination,
  onPaginationChange,
  onSearchChange,
  onSortChange,
  onTypeFilterChange,
  onStatusFilterChange,
}: TransactionsDataTableProps) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<TransactionType | "all">(
    "all",
  );
  const [statusFilter, setStatusFilter] = React.useState<
    TransactionStatus | "all"
  >("all");

  const columns: ColumnDef<TransactionListItem>[] = React.useMemo(
    () => [
      {
        accessorKey: "userName",
        header: "User",
        cell: ({ row }) => {
          const transaction = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {transaction.userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-primary">
                  {transaction.userName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {transaction.userEmail}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const type = row.original.type;
          return (
            <div className="flex items-center gap-2">
              {type === "deposit" ? (
                <IconArrowDown
                  className="w-4 h-4"
                  style={{ color: "var(--green)" }}
                />
              ) : (
                <IconArrowUp
                  className="w-4 h-4"
                  style={{ color: "var(--orange)" }}
                />
              )}
              <Badge variant="outline" className={getTypeColor(type)}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
          const transaction = row.original;
          const isDeposit = transaction.type === "deposit";
          return (
            <span
              className="font-semibold"
              style={{ color: isDeposit ? "var(--green)" : "var(--orange)" }}
            >
              {isDeposit ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </span>
          );
        },
      },
      {
        accessorKey: "balanceAfter",
        header: "Balance After",
        cell: ({ row }) => {
          return (
            <span className="text-sm font-medium">
              {formatCurrency(row.original.balanceAfter)}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Badge variant="outline" className={getStatusColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
          return (
            <span className="text-sm text-muted-foreground">
              {row.original.description || "N/A"}
            </span>
          );
        },
      },
      {
        accessorKey: "referenceId",
        header: "Reference ID",
        cell: ({ row }) => {
          return (
            <span className="text-sm font-mono text-muted-foreground">
              {row.original.referenceId || "N/A"}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt);
          return (
            <span className="text-sm text-muted-foreground">
              {date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: pagination.totalPages,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
      if (newSorting.length > 0) {
        onSortChange(newSorting[0].id, newSorting[0].desc ? "desc" : "asc");
      }
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleSearch = React.useCallback(
    (value: string) => {
      setSearchValue(value);
      onSearchChange(value);
    },
    [onSearchChange],
  );

  const handleTypeFilter = React.useCallback(
    (value: TransactionType | "all") => {
      setTypeFilter(value);
      onTypeFilterChange(value);
    },
    [onTypeFilterChange],
  );

  const handleStatusFilter = React.useCallback(
    (value: TransactionStatus | "all") => {
      setStatusFilter(value);
      onStatusFilterChange(value);
    },
    [onStatusFilterChange],
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by user name or email..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchValue && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => handleSearch("")}
              >
                <IconX className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Select value={typeFilter} onValueChange={handleTypeFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="withdrawal">Withdrawal</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Columns <IconChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing{" "}
          {data.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}{" "}
          to {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
          {pagination.total} transactions
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${pagination.limit}`}
              onValueChange={(value) => {
                onPaginationChange(1, Number(value));
              }}
            >
              <SelectTrigger className="w-20" size="sm" id="rows-per-page">
                <SelectValue placeholder={pagination.limit} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-center text-sm font-medium">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => onPaginationChange(1, pagination.limit)}
              disabled={pagination.page === 1}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                onPaginationChange(pagination.page - 1, pagination.limit)
              }
              disabled={pagination.page === 1}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                onPaginationChange(pagination.page + 1, pagination.limit)
              }
              disabled={pagination.page === pagination.totalPages}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() =>
                onPaginationChange(pagination.totalPages, pagination.limit)
              }
              disabled={pagination.page === pagination.totalPages}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
