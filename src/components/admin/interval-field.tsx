"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  TimeUnit,
  convertToMinutes,
  convertBetweenUnits,
} from "@/lib/time-converter";
import { UseFormReturn } from "react-hook-form";
import { UpdateAdminSettingType } from "@/schema/admin-setting.schema";

interface IntervalFieldProps {
  form: UseFormReturn<UpdateAdminSettingType>;
  name: "iniInterval" | "iniEasyInterval";
  label: string;
  value: number;
  unit: TimeUnit;
  onValueChange: (value: number) => void;
  onUnitChange: (unit: TimeUnit) => void;
  onChange: (value: number, unit: TimeUnit) => void;
}

export function IntervalField({
  form,
  name,
  label,
  value,
  unit,
  onValueChange,
  onUnitChange,
  onChange,
}: IntervalFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const handleUnitChange = (newUnit: TimeUnit) => {
          if (unit !== newUnit) {
            if (value > 0) {
              const convertedValue = convertBetweenUnits(value, unit, newUnit);
              onChange(convertedValue, newUnit);
              const minutes = convertToMinutes(convertedValue, newUnit);
              field.onChange(Math.round(minutes));
            } else {
              onChange(value, newUnit);
            }
          }
        };

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter time value"
                  value={value || ""}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value) || 0;
                    onValueChange(newValue);
                    const minutes = convertToMinutes(newValue, unit);
                    field.onChange(Math.round(minutes));
                  }}
                  className="flex-1"
                />
              </FormControl>
              <Select value={unit} onValueChange={handleUnitChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
