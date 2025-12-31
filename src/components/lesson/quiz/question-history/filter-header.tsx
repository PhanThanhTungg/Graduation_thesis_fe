import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface FilterHeaderProps {
  hasActiveFilters: boolean;
  onReset: () => void;
}

export function FilterHeader({ hasActiveFilters, onReset }: FilterHeaderProps) {
  return (
    <div className="flex items-center justify-between mt-[-30px]">
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={onReset}
        >
          Reset Filters
        </Button>
      )}
    </div>
  );
}
