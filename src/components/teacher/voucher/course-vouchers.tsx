"use client";

import { VoucherType } from "@/schema/voucher.schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Tag, Calendar, TrendingDown, Users, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { CreateVoucherDialog } from "./create-voucher-dialog";
import { EditVoucherDialog } from "./edit-voucher-dialog";
import { DeleteVoucherDialog } from "./delete-voucher-dialog";
import { useRouter } from "next/navigation";

interface CourseVouchersProps {
  courseId: string;
  coursePrice: number;
  vouchers: VoucherType[];
}

export function CourseVouchers({ courseId, coursePrice, vouchers }: CourseVouchersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleVoucherChange = () => {
    router.refresh();
  };

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
        return <CheckCircle2 className="w-4 h-4" />;
      case "warning":
        return <AlertCircle className="w-4 h-4" />;
      case "inactive":
        return <XCircle className="w-4 h-4" />;
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
      day: "numeric" 
    });
  };


  return (
    <Card className="border-2 border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-accent/5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-lg bg-gradient-to-br from-violet/20 to-mint/20">
                  <Tag className="w-5 h-5 text-violet" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">Course Vouchers</CardTitle>
                  <CardDescription className="mt-1">
                    {vouchers.length > 0 
                      ? `${vouchers.length} ${vouchers.length === 1 ? 'voucher' : 'vouchers'} available for this course`
                      : 'No vouchers available for this course'}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div onClick={(e) => e.stopPropagation()}>
                  <CreateVoucherDialog courseId={courseId} coursePrice={coursePrice} onVoucherCreated={handleVoucherChange} />
                </div>
                <Button variant="ghost" size="sm" className="gap-2">
                  {isOpen ? (
                    <>
                      <span className="text-sm">Hide</span>
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span className="text-sm">Show</span>
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {vouchers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Tag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No vouchers available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vouchers.map((voucher) => {
                  return (
                    <Card 
                      key={voucher.id} 
                      className="border-l-4 border-l-violet hover:shadow-md transition-all hover:scale-[1.01] bg-gradient-to-r from-background to-accent/5"
                    >
                      <CardContent className="p">
                        <div className="flex flex-col gap-4">
                          {/* Main Content */}
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Left Section - Code and Discount */}
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
                                <TrendingDown className="w-4 h-4" />
                                <span className="text-lg">
                                  {formatDiscount(voucher.discountType, voucher.discountValue)} OFF
                                </span>
                              </div>
                              <Badge variant="outline" className="bg-mint/10 border-mint/30">
                                {voucher.discountType === "percentage" ? "Percentage" : "Fixed Amount"}
                              </Badge>
                            </div>

                            {voucher.course && (
                              <p className="text-sm text-muted-foreground">
                                Applicable to: <span className="font-medium text-foreground">{voucher.course.title}</span>
                              </p>
                            )}
                            {!voucher.courseId && (
                              <p className="text-sm text-muted-foreground">
                                Applicable to: <span className="font-medium text-green">All courses</span>
                              </p>
                            )}
                            </div>

                            {/* Right Section - Dates and Usage */}
                            <div className="flex flex-col gap-2 text-sm min-w-[200px]">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <div>
                                  <div className="font-medium text-foreground">Valid Period</div>
                                  <div className="text-xs">
                                    {formatDate(voucher.startDate)} - {formatDate(voucher.endDate)}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <div>
                                  <div className="font-medium text-foreground">Usage</div>
                                  <div className="text-xs">
                                    {voucher.usedCount} / {voucher.usageLimit || "Unlimited"} used
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50" onClick={(e) => e.stopPropagation()}>
                            <EditVoucherDialog voucher={voucher} coursePrice={coursePrice} onVoucherUpdated={handleVoucherChange} />
                            <DeleteVoucherDialog 
                              voucherId={voucher.id} 
                              voucherCode={voucher.code}
                              onVoucherDeleted={handleVoucherChange}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
