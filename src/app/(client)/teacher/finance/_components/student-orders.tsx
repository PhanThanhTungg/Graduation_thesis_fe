"use client";

import { useState, useEffect, useCallback } from "react";
import { getOrders } from "@/service/finance.service";
import { getMyCourses } from "@/service/course.service";
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
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { showToast } from "@/lib/toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type Order = {
  id: string;
  Order_id: string;
  userId: string;
  courseId: string;
  discountAmount: number;
  finalPrice: number;
  status: "processing" | "success" | "cancelled";
  paymentMethod: "paypal";
  createdAt: string;
  completedAt: string | null;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
    slug: string;
  };
};

type Course = {
  id: string;
  title: string;
};

export function StudentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortField, setSortField] = useState<"finalPrice" | "createdAt">(
    "createdAt",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [courseId, setCourseId] = useState<string>("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getMyCourses({ limit: 1000 });
        setCourses(
          coursesData.courses.map((course) => ({
            id: String(course.id),
            title: course.title,
          })),
        );
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const ordersData = await getOrders({
        page,
        limit,
        sortField,
        sortOrder,
        courseId: courseId === "all" ? undefined : courseId,
      });

      setOrders(ordersData.orders);
      if (ordersData.pagination) {
        setTotal(ordersData.pagination.total);
        setTotalPages(ordersData.pagination.totalPages);
      }
    } catch (error) {
      showToast("error", "Failed to fetch orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortField, sortOrder, courseId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green";
      case "processing":
        return "text-yellow";
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

  const hasActiveFilters = courseId !== "all";

  const handleClearFilters = () => {
    setCourseId("all");
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");
    setSortField(field as "finalPrice" | "createdAt");
    setSortOrder(order as "asc" | "desc");
    setPage(1);
  };

  const handleCourseChange = (value: string) => {
    setCourseId(value);
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Orders</CardTitle>
              <CardDescription>Orders for your courses</CardDescription>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="flex flex-wrap gap-3 items-center mb-6">
              <Select value={courseId} onValueChange={handleCourseChange}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
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
                  <SelectItem value="finalPrice-desc">
                    Price (High-Low)
                  </SelectItem>
                  <SelectItem value="finalPrice-asc">
                    Price (Low-High)
                  </SelectItem>
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
            ) : orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {order.user.fullName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {order.course.title}
                      </TableCell>
                      <TableCell className="font-medium text-green">
                        {formatPrice(order.finalPrice)}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No orders found
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
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
