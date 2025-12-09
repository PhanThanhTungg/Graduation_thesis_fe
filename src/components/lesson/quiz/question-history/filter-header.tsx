import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface FilterHeaderProps {
  hasActiveFilters: boolean;
  onReset: () => void;
}

export function FilterHeader({ hasActiveFilters, onReset }: FilterHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Filter className="w-4 h-4 text-orange" />
        Filters & Sorting
      </h3>
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
