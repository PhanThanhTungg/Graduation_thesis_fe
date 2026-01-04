"use client";

import { useState } from "react";
import { createDeposit } from "@/service/finance.service";
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

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DepositModal({
  open,
  onOpenChange,
  onSuccess,
}: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount) {
      showToast("error", "Please enter deposit amount");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast("error", "Invalid amount");
      return;
    }

    try {
      setIsLoading(true);
      const depositData = await createDeposit(amountNum);

      if (depositData.approvalUrl) {
        localStorage.setItem(
          "pendingDeposit",
          JSON.stringify({
            transactionId: depositData.transactionId,
            paypalOrderId: depositData.paypalOrderId,
          }),
        );
        window.location.href = depositData.approvalUrl;
      }
    } catch (error) {
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to create deposit request",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Deposit Money</DialogTitle>
          <DialogDescription>
            Add money to your wallet via PayPal
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">
              Amount <span className="text-destructive">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              required
              disabled={isLoading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Continue to PayPal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
