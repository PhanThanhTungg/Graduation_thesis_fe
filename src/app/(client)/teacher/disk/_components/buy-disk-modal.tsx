"use client";

import { useState, useEffect } from "react";
import { purchaseDiskSpace } from "@/service/finance.service";
import { showToast } from "@/lib/toast";
import { formatPrice } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { get } from "@/lib/request";

interface BuyDiskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  walletBalance: number;
}

export function BuyDiskModal({
  open,
  onOpenChange,
  onSuccess,
  walletBalance,
}: BuyDiskModalProps) {
  const [value, setValue] = useState("");
  const [months, setMonths] = useState("1");
  const [feeUploadPer100Mb, setFeeUploadPer100Mb] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFee, setIsLoadingFee] = useState(true);

  useEffect(() => {
    if (open) {
      fetchFeeUploadPer100Mb();
    }
  }, [open]);

  const fetchFeeUploadPer100Mb = async () => {
    try {
      setIsLoadingFee(true);
      const response = await get<{ data: { feeUploadPer100Mb: number } }>(
        "/api/setting/admin/fee-upload",
        undefined,
      );

      if (response.status === 200) {
        const payload = response.payload as {
          data: { feeUploadPer100Mb: number };
        };
        setFeeUploadPer100Mb(payload.data.feeUploadPer100Mb);
      }
    } catch (error) {
      showToast("error", "Failed to load pricing information");
      setFeeUploadPer100Mb(0.1);
    } finally {
      setIsLoadingFee(false);
    }
  };

  const calculatePrice = (): number => {
    if (!feeUploadPer100Mb || !value || !months) return 0;
    const valueNum = parseFloat(value);
    const monthsNum = parseFloat(months);
    if (
      isNaN(valueNum) ||
      isNaN(monthsNum) ||
      valueNum <= 0 ||
      monthsNum <= 0
    ) {
      return 0;
    }
    return (valueNum / 100) * feeUploadPer100Mb * monthsNum;
  };

  const totalPrice = calculatePrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!value || !months) {
      showToast("error", "Please enter value and months");
      return;
    }

    const valueNum = parseFloat(value);
    const monthsNum = parseFloat(months);

    if (isNaN(valueNum) || valueNum <= 0) {
      showToast("error", "Invalid value");
      return;
    }

    if (isNaN(monthsNum) || monthsNum <= 0) {
      showToast("error", "Invalid months");
      return;
    }

    if (walletBalance < totalPrice) {
      showToast("error", "Insufficient balance");
      return;
    }

    try {
      setIsLoading(true);
      await purchaseDiskSpace({
        value: valueNum,
        months: monthsNum,
      });

      showToast("success", "Disk space purchased successfully");
      setValue("");
      setMonths("1");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to purchase disk space",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Purchase Disk Space</DialogTitle>
          <DialogDescription>
            Buy additional disk space for your courses
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="value">
              Disk Space (MB) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="value"
              type="number"
              placeholder="Enter disk space in MB"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              min="1"
              step="1"
              required
              disabled={isLoading || isLoadingFee}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="months">
              Months <span className="text-destructive">*</span>
            </Label>
            <Input
              id="months"
              type="number"
              placeholder="Enter number of months"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              min="1"
              step="1"
              required
              disabled={isLoading || isLoadingFee}
            />
          </div>

          {!isLoadingFee && feeUploadPer100Mb !== null && (
            <div className="space-y-2 rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Price per 100MB:</span>
                <span className="font-semibold">
                  {formatPrice(feeUploadPer100Mb)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Price:</span>
                <span className="text-lg font-bold text-green">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isLoadingFee || totalPrice === 0}
            >
              {isLoading ? "Processing..." : "Purchase"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
