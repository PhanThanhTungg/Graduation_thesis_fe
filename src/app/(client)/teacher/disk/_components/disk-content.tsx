"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getDiskSpace,
  getDiskPurchaseHistory,
  getWallet,
} from "@/service/finance.service";
import { BuyDiskModal } from "./buy-disk-modal";
import { UploadedFilesCard } from "./uploaded-files-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { formatDate } from "@/lib/helpers";

export function DiskContent() {
  const [diskSpace, setDiskSpace] = useState<{
    id: string;
    userId: string;
    value: number;
    from: string;
    to: string;
    usedSpace: number;
  } | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<
    {
      id: string;
      value: number;
      months: number;
      pricePer100Mb: number;
      totalPrice: number;
      createdAt: string;
      dateFrom: string;
      dateTo: string;
    }[]
  >([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [diskData, historyData, walletData] = await Promise.all([
        getDiskSpace(),
        getDiskPurchaseHistory({
          page: pagination.page,
          limit: pagination.limit,
        }),
        getWallet(),
      ]);
      setDiskSpace(diskData);
      setPurchaseHistory(historyData.purchases);
      setPagination(historyData.pagination);
      setWalletBalance(walletData.balance);
    } catch (error) {
      console.error("Failed to fetch disk space:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePurchaseSuccess = () => {
    fetchData();
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (value: string) => {
    setPagination((prev) => ({ ...prev, limit: Number(value), page: 1 }));
  };

  const columns = useMemo<ColumnDef<(typeof purchaseHistory)[0]>[]>(
    () => [
      {
        accessorKey: "dateFrom",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 px-2 lg:px-3"
            >
              Date From
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => formatDate(row.original.dateFrom),
      },
      {
        accessorKey: "dateTo",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 px-2 lg:px-3"
            >
              Date To
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => formatDate(row.original.dateTo),
      },
      {
        accessorKey: "value",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 px-2 lg:px-3"
            >
              Disk Space
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => `${row.original.value.toLocaleString()} MB`,
      },
      {
        accessorKey: "months",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 px-2 lg:px-3"
            >
              Months
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => row.original.months,
      },
      {
        accessorKey: "pricePer100Mb",
        header: "Price per 100MB",
        cell: ({ row }) => formatPrice(row.original.pricePer100Mb),
      },
      {
        accessorKey: "totalPrice",
        header: ({ column }) => {
          return (
            <div className="text-right">
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="h-8 px-2 lg:px-3"
              >
                Total Price
                {column.getIsSorted() === "asc" ? (
                  <ArrowUp className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === "desc" ? (
                  <ArrowDown className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            </div>
          );
        },
        cell: ({ row }) => (
          <div className="text-right font-semibold">
            {formatPrice(row.original.totalPrice)}
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: purchaseHistory,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (isLoading) {
    return (
      <div className="w-full py-12 px-4 md:px-6 lg:px-8">
        <section className="mb-8">
          <h1 className="font-heading font-semibold text-3xl text-foreground mb-2">
            Disk
          </h1>
        </section>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 px-4 md:px-6 lg:px-8">
      <section className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-semibold text-3xl text-foreground mb-2">
              Disk
            </h1>
            <p className="text-muted-foreground">
              Manage your disk space for course content
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            Purchase Disk Space
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Current Disk Space</CardTitle>
          </CardHeader>
          <CardContent>
            {diskSpace ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Total Space
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {diskSpace.value.toLocaleString()} MB
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Used Space
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {Math.round(
                      diskSpace.usedSpace / (1024 * 1024),
                    ).toLocaleString()}{" "}
                    MB
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Available Space
                  </div>
                  <div className="text-2xl font-bold text-green">
                    {Math.max(
                      0,
                      diskSpace.value -
                        Math.round(diskSpace.usedSpace / (1024 * 1024)),
                    ).toLocaleString()}{" "}
                    MB
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">
                No disk space purchased yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <UploadedFilesCard />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          {purchaseHistory.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {pagination.total > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Items per page:</span>
                    <Select
                      value={pagination.limit.toString()}
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
                      Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total,
                      )}{" "}
                      of {pagination.total}
                    </span>
                  </div>
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline ml-2">Previous</span>
                      </Button>
                      <div className="px-4 text-sm font-medium">
                        Page {pagination.page} of {pagination.totalPages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                      >
                        <span className="hidden sm:inline mr-2">Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-muted-foreground text-center py-8">
              No purchase history yet
            </div>
          )}
        </CardContent>
      </Card>

      <BuyDiskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handlePurchaseSuccess}
        walletBalance={walletBalance}
      />
    </div>
  );
}
