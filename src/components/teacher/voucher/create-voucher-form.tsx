"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateVoucherSchema, CreateVoucherType } from "@/schema/voucher.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createVoucher } from "@/service/voucher.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateVoucherFormProps {
  courseId: string;
  coursePrice: number;
  onSuccess: () => void;
}

export function CreateVoucherForm({ courseId, coursePrice, onSuccess }: CreateVoucherFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateVoucherType>({
    resolver: zodResolver(CreateVoucherSchema),
    defaultValues: {
      code: "",
      courseId: courseId,
      discountType: "percentage",
      discountValue: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: undefined,
    },
  });

  const onSubmit = async (data: CreateVoucherType) => {
    setIsLoading(true);
    try {
      // Validate discount value one more time on submit
      const validationResult = validateDiscountValue(data.discountValue);
      if (validationResult !== true) {
        form.setError("discountValue", {
          type: "manual",
          message: validationResult,
        });
        setIsLoading(false);
        return;
      }

      // Convert dates to ISO string with time
      const startDateTime = new Date(data.startDate);
      startDateTime.setHours(0, 0, 0, 0);
      const endDateTime = new Date(data.endDate);
      endDateTime.setHours(23, 59, 59, 999);

      await createVoucher({
        ...data,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
      });
      
      toast.success("Voucher created successfully!");
      onSuccess();
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create voucher");
    } finally {
      setIsLoading(false);
    }
  };

  const discountType = form.watch("discountType");
  const maxFixedDiscount = coursePrice / 2;

  const validateDiscountValue = (value: number) => {
    if (!value || value <= 0) {
      return "Discount value must be greater than 0";
    }
    
    if (discountType === "percentage") {
      if (value > 50) {
        return "Percentage discount cannot exceed 50%";
      }
    } else if (discountType === "fixed_amount") {
      if (value > maxFixedDiscount) {
        return `Fixed discount cannot exceed $${maxFixedDiscount.toFixed(2)} (half of course price)`;
      }
    }
    
    return true;
  };

  const validateDateRange = () => {
    const startDate = form.getValues("startDate");
    const endDate = form.getValues("endDate");
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start >= end) {
        return "End date must be after start date";
      }
    }
    
    return true;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voucher Code *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., SUMMER2024" 
                  {...field} 
                  className="uppercase"
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed_amount">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Value *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder={discountType === "percentage" ? "e.g., 20" : "e.g., 10.00"}
                    {...field}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      field.onChange(value);
                    }}
                    onBlur={(e) => {
                      field.onBlur();
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        const validationResult = validateDiscountValue(value);
                        if (validationResult !== true) {
                          form.setError("discountValue", {
                            type: "manual",
                            message: validationResult,
                          });
                        } else {
                          form.clearErrors("discountValue");
                        }
                      }
                    }}
                  />
                </FormControl>
                {!form.formState.errors.discountValue && (
                  <FormDescription>
                    {discountType === "percentage" 
                      ? "" 
                      : `Max $${maxFixedDiscount.toFixed(2)} (half of course price)`}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date *</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field}
                    onBlur={() => {
                      field.onBlur();
                      const validationResult = validateDateRange();
                      if (validationResult !== true) {
                        form.setError("endDate", {
                          type: "manual",
                          message: validationResult,
                        });
                      } else {
                        form.clearErrors("endDate");
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date *</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field}
                    onBlur={() => {
                      field.onBlur();
                      const validationResult = validateDateRange();
                      if (validationResult !== true) {
                        form.setError("endDate", {
                          type: "manual",
                          message: validationResult,
                        });
                      } else {
                        form.clearErrors("endDate");
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="usageLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usage Limit (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Leave empty for unlimited"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </FormControl>
              <FormDescription>
                Maximum number of times this voucher can be used
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-violet to-green">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Voucher
          </Button>
        </div>
      </form>
    </Form>
  );
}
