"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PaymentListItem, PaymentStatus } from "@/lib/admin-payments-mock-data";
import { getStatusColor } from "./listPayments";

interface PaymentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentListItem | null;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const generateQRCodeUrl = (paymentId: string) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentId)}`;
};

export function PaymentDetailModal({
  open,
  onOpenChange,
  payment,
}: PaymentDetailModalProps) {
  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogDescription>
            Detailed information about the withdrawal request
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg border-2 border-border">
              <img
                src={generateQRCodeUrl(payment.id)}
                alt="QR Code"
                className="w-48 h-48"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Payment ID
              </label>
              <p className="text-sm font-mono text-foreground">{payment.id}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div>
                <Badge
                  variant="outline"
                  className={getStatusColor(payment.status)}
                >
                  {payment.status.charAt(0).toUpperCase() +
                    payment.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Amount
              </label>
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(payment.amount)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Created At
              </label>
              <p className="text-sm text-foreground">
                {formatDate(payment.createdAt)}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Teacher Information
            </h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {payment.teacherName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-foreground">
                  {payment.teacherName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {payment.teacherEmail}
                </span>
              </div>
            </div>
          </div>

          {payment.bankName && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Bank Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Bank Name
                  </label>
                  <p className="text-sm text-foreground">{payment.bankName}</p>
                </div>
                {payment.bankAccount && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Account Number
                    </label>
                    <p className="text-sm font-mono text-foreground">
                      {payment.bankAccount}
                    </p>
                  </div>
                )}
                {payment.bankAccountName && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Account Name
                    </label>
                    <p className="text-sm text-foreground">
                      {payment.bankAccountName}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {payment.note && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Note
              </h3>
              <p className="text-sm text-foreground bg-secondary p-3 rounded-lg">
                {payment.note}
              </p>
            </div>
          )}

          {payment.rejectionReason && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-destructive mb-2">
                Rejection Reason
              </h3>
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                {payment.rejectionReason}
              </p>
            </div>
          )}

          {payment.processedAt && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Processing Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Processed At
                  </label>
                  <p className="text-sm text-foreground">
                    {formatDate(payment.processedAt)}
                  </p>
                </div>
                {payment.processedBy && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Processed By
                    </label>
                    <p className="text-sm text-foreground">
                      {payment.processedBy}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {payment.updatedAt && (
            <div className="border-t pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </label>
                <p className="text-sm text-foreground">
                  {formatDate(payment.updatedAt)}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
