"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MyLearningSearchProps {
  onSearchChange: (value: string) => void;
}

export default function MyLearningSearch({
  onSearchChange,
}: MyLearningSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
      <Input
        type="text"
        placeholder="Search your courses..."
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 w-full max-w-md"
      />
    </div>
  );
}
