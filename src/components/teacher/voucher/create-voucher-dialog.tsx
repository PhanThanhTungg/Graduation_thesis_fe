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
import { CreateVoucherForm } from "./create-voucher-form";
import { Plus } from "lucide-react";

interface CreateVoucherDialogProps {
  courseId: string;
  coursePrice: number;
  onVoucherCreated?: () => void;
}

export function CreateVoucherDialog({
  courseId,
  coursePrice,
  onVoucherCreated,
}: CreateVoucherDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onVoucherCreated) {
      onVoucherCreated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Voucher
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Voucher</DialogTitle>
          <DialogDescription>
            Create a discount voucher for this course
          </DialogDescription>
        </DialogHeader>
        <CreateVoucherForm courseId={courseId} coursePrice={coursePrice} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
