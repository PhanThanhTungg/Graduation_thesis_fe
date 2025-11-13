"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteVoucher } from "@/service/voucher.service";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteVoucherDialogProps {
  voucherId: string;
  voucherCode: string;
  onVoucherDeleted?: () => void;
}

export function DeleteVoucherDialog({
  voucherId,
  voucherCode,
  onVoucherDeleted,
}: DeleteVoucherDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteVoucher(voucherId);
      toast.success("Voucher deleted successfully!");
      setOpen(false);
      if (onVoucherDeleted) {
        onVoucherDeleted();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete voucher");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Voucher</DialogTitle>
          <DialogDescription className="pt-4">
            Are you sure you want to delete the voucher <span className="font-mono font-bold text-foreground">{voucherCode}</span>?
            <br />
            <span className="text-destructive font-medium">This action cannot be undone.</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Voucher
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
