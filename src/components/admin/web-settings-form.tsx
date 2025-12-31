"use client";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UpdateAdminSettingType } from "@/schema/admin-setting.schema";
import { UseFormReturn } from "react-hook-form";

interface WebSettingsFormProps {
  form: UseFormReturn<UpdateAdminSettingType>;
}

export function WebSettingsForm({ form }: WebSettingsFormProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="webTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Web Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter web title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="webFavicon"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Web Favicon URL</FormLabel>
            <FormControl>
              <Input placeholder="Enter favicon URL" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="webDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Web Description</FormLabel>
            <FormControl>
              <Input placeholder="Enter web description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="webKeywords"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Web Keywords (comma-separated)</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter keywords separated by commas"
                value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                onChange={(e) => {
                  const keywords = e.target.value
                    .split(",")
                    .map((k) => k.trim())
                    .filter((k) => k.length > 0);
                  field.onChange(keywords);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="webAuthor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Web Author</FormLabel>
            <FormControl>
              <Input placeholder="Enter web author" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="webCopyright"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Web Copyright</FormLabel>
            <FormControl>
              <Input placeholder="Enter copyright text" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
