"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditVoucherForm } from "./edit-voucher-form";
import { VoucherType } from "@/schema/voucher.schema";
import { Pencil } from "lucide-react";

interface EditVoucherDialogProps {
  voucher: VoucherType;
  coursePrice: number;
  onVoucherUpdated?: () => void;
}

export function EditVoucherDialog({
  voucher,
  coursePrice,
  onVoucherUpdated,
}: EditVoucherDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onVoucherUpdated) {
      onVoucherUpdated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-violet hover:text-violet hover:bg-violet/10">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Voucher</DialogTitle>
          <DialogDescription>
            Update the details of the voucher: <span className="font-mono font-bold">{voucher.code}</span>
          </DialogDescription>
        </DialogHeader>
        <EditVoucherForm voucher={voucher} coursePrice={coursePrice} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
