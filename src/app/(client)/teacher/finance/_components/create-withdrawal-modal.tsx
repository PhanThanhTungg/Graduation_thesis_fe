"use client";

import { useState } from "react";
import { createWithdrawal } from "@/service/finance.service";
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
import { Textarea } from "@/components/ui/textarea";

interface CreateWithdrawalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  balance: number;
}

export function CreateWithdrawalModal({
  open,
  onOpenChange,
  onSuccess,
  balance,
}: CreateWithdrawalModalProps) {
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !email) {
      showToast("error", "Please fill in all required fields");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast("error", "Invalid amount");
      return;
    }

    if (amountNum > balance) {
      showToast("error", "Insufficient balance");
      return;
    }

    try {
      setIsLoading(true);
      await createWithdrawal({
        amount: amountNum,
        email,
        note: note || undefined,
      });
      showToast("success", "Withdrawal request created successfully");
      setAmount("");
      setEmail("");
      setNote("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to create withdrawal request",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Withdrawal Request</DialogTitle>
          <DialogDescription>
            Request to withdraw money to your PayPal account
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
            <p className="text-xs text-muted-foreground">
              Available balance: {formatPrice(balance)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              PayPal Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
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
              {isLoading ? "Creating..." : "Create Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
