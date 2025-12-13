"use client";

import { useEffect, useState, useMemo } from "react";
import { getMyCourses } from "@/service/course.service";
import { getVouchersByCourseId } from "@/service/voucher.service";
import { ExtendedCourseType } from "@/schema/course.schema";
import { VoucherType } from "@/schema/voucher.schema";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { showToast } from "@/lib/toast";
import { AlertCircle, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { CreateVoucherDialog } from "@/components/teacher/voucher/create-voucher-dialog";
import { EditVoucherDialog } from "@/components/teacher/voucher/edit-voucher-dialog";
import { DeleteVoucherDialog } from "@/components/teacher/voucher/delete-voucher-dialog";

export default function VouchersPage() {
  const [courses, setCourses] = useState<ExtendedCourseType[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [vouchers, setVouchers] = useState<VoucherType[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ExtendedCourseType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "warning">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Load courses on mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoadingCourses(true);
        const result = await getMyCourses();
        const courseList = result.courses || [];
        setCourses(courseList);

        // Select the first course by default
        if (courseList.length > 0) {
          setSelectedCourseId(String(courseList[0].id));
          setSelectedCourse(courseList[0]);
        }
      } catch (error) {
        showToast("error", "Failed to load courses");
        console.error(error);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  // Load vouchers when course selection changes
  useEffect(() => {
    if (!selectedCourseId) return;

    const loadVouchers = async () => {
      try {
        setIsLoadingVouchers(true);
        const voucherList = await getVouchersByCourseId(selectedCourseId);
        setVouchers(voucherList || []);
      } catch (error) {
        showToast("error", "Failed to load vouchers");
        console.error(error);
        setVouchers([]);
      } finally {
        setIsLoadingVouchers(false);
      }
    };

    loadVouchers();
    setSearchQuery("");
    setStatusFilter("all");
    setCurrentPage(1);
  }, [selectedCourseId]);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    const course = courses.find((c) => String(c.id) === courseId);
    setSelectedCourse(course || null);
  };

  // Filter vouchers based on search and status
  const filteredVouchers = useMemo(() => {
    return vouchers.filter((voucher) => {
      const matchesSearch = voucher.code
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || voucher.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [vouchers, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);
  const paginatedVouchers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVouchers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVouchers, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const activeVouchersCount = vouchers.filter(
    (v) => v.status === "active"
  ).length;
  const warningVouchersCount = vouchers.filter(
    (v) => v.status === "warning"
  ).length;

  const handleVoucherChange = async () => {
    if (!selectedCourseId) return;
    try {
      const voucherList = await getVouchersByCourseId(selectedCourseId);
      setVouchers(voucherList || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to refresh vouchers:", error);
    }
  };

  return (
    <div className="w-full py-8 px-4 md:px-6 lg:px-8">
      {/* Header */}
      <section className="mb-8">
        <h1 className="font-heading font-semibold text-3xl text-foreground mb-2">
          Voucher Management
        </h1>
        <p className="text-lg text-muted-foreground">
          Create and manage discount vouchers for your courses
        </p>
      </section>

      {/* Main Content */}
      {isLoadingCourses ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : courses.length === 0 ? (
        <Card className="border-2 border-yellow/20 bg-yellow/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-yellow">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-medium text-base">No courses found</p>
                <p className="text-sm">Create a course first to manage vouchers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-violet/20 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">
                  {selectedCourse?.title || "Select a Course"}
                </CardTitle>
                <CardDescription className="mt-1">
                  Manage vouchers for this course
                </CardDescription>
              </div>
              <Select value={selectedCourseId} onValueChange={handleCourseChange}>
                <SelectTrigger className="w-full md:w-64 border-violet/30 focus:border-violet focus:ring-violet/20">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={String(course.id)}>
                      <span className="font-medium">{course.title}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Stats Bar */}
            {selectedCourseId && (
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="bg-green/10 text-green border-green/30">
                  <span className="font-semibold">{activeVouchersCount}</span>
                  <span className="ml-1">Active</span>
                </Badge>
                <Badge variant="outline" className="bg-yellow/10 text-yellow border-yellow/30">
                  <span className="font-semibold">{warningVouchersCount}</span>
                  <span className="ml-1">Warning</span>
                </Badge>
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                  <span className="font-semibold">{vouchers.length - activeVouchersCount - warningVouchersCount}</span>
                  <span className="ml-1">Inactive</span>
                </Badge>
                <div className="flex-1" />
                {selectedCourseId && selectedCourse && (
                  <CreateVoucherDialog
                    courseId={selectedCourseId}
                    coursePrice={selectedCourse.price || 0}
                    onVoucherCreated={handleVoucherChange}
                  />
                )}
              </div>
            )}

            {/* Search and Filter Bar */}
            {selectedCourseId && !isLoadingVouchers && vouchers.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by voucher code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-violet/30 focus:border-violet focus:ring-violet/20"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger className="w-full sm:w-[180px] border-violet/30 focus:border-violet focus:ring-violet/20">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                {(searchQuery || statusFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                    className="text-violet hover:text-violet hover:bg-violet/10"
                  >
                    Reset Filters
                  </Button>
                )}
              </div>
            )}

            {/* Vouchers List */}
            {isLoadingVouchers ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : selectedCourseId && selectedCourse ? (
              <>
                {filteredVouchers.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground text-base">
                      {vouchers.length === 0
                        ? "No vouchers for this course yet"
                        : "No vouchers match your search or filter"}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {paginatedVouchers.map((voucher) => (
                        <VoucherCard
                          key={voucher.id}
                          voucher={voucher}
                          coursePrice={selectedCourse.price || 0}
                          onVoucherUpdated={handleVoucherChange}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                        <div className="text-sm text-muted-foreground">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                          {Math.min(currentPage * itemsPerPage, filteredVouchers.length)} of{" "}
                          {filteredVouchers.length} vouchers
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="border-violet/30 hover:border-violet"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={
                                  currentPage === page
                                    ? "bg-violet text-white"
                                    : "border-violet/30 hover:border-violet"
                                }
                              >
                                {page}
                              </Button>
                            ))}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="border-violet/30 hover:border-violet"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Inline Voucher Card Component for filtered display
function VoucherCard({
  voucher,
  coursePrice,
  onVoucherUpdated,
}: {
  voucher: VoucherType;
  coursePrice: number;
  onVoucherUpdated: () => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green/10 text-green border-green/20";
      case "warning":
        return "bg-yellow/10 text-yellow border-yellow/20";
      case "inactive":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return "✓";
      case "warning":
        return "⚠";
      case "inactive":
        return "✕";
      default:
        return null;
    }
  };

  const formatDiscount = (type: string, value: number) => {
    if (type === "percentage") {
      return `${value}%`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="border-l-4 border-l-violet hover:shadow-md transition-all hover:scale-[1.01] bg-gradient-to-r from-background to-accent/5">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Main Content */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left Section */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="text-base font-mono font-bold px-3 py-1 bg-gradient-to-r from-violet to-green text-white border-0">
                  {voucher.code}
                </Badge>
                <Badge className={getStatusColor(voucher.status)} variant="outline">
                  <span className="flex items-center gap-1">
                    {getStatusIcon(voucher.status)}
                    {voucher.status}
                  </span>
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-green font-semibold">
                  <span className="text-lg">
                    {formatDiscount(voucher.discountType, voucher.discountValue)} OFF
                  </span>
                </div>
                <Badge variant="outline" className="bg-mint/10 border-mint/30">
                  {voucher.discountType === "percentage" ? "Percentage" : "Fixed Amount"}
                </Badge>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col gap-2 text-sm min-w-[200px] text-muted-foreground">
              <div>
                <div className="font-medium text-foreground">Valid:</div>
                <div className="text-xs">
                  {formatDate(voucher.startDate)} - {formatDate(voucher.endDate)}
                </div>
              </div>
              <div>
                <div className="font-medium text-foreground">Usage:</div>
                <div className="text-xs">
                  {voucher.usedCount} / {voucher.usageLimit || "Unlimited"} used
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
            <EditVoucherDialog
              voucher={voucher}
              coursePrice={coursePrice}
              onVoucherUpdated={onVoucherUpdated}
            />
            <DeleteVoucherDialog
              voucherId={voucher.id}
              voucherCode={voucher.code}
              onVoucherDeleted={onVoucherUpdated}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
