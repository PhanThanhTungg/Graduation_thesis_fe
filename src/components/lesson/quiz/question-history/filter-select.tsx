import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FilterSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: Array<{
    value: string;
    label: string;
    color?: string;
    icon?: React.ReactNode;
  }>;
}

export function FilterSelect({
  label,
  value,
  onValueChange,
  placeholder,
  options,
}: FilterSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-10 border-2 hover:border-orange/50 transition-colors">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent style={{ zIndex: 150 }}>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                {option.color && (
                  <div className={cn("w-2 h-2 rounded-full", option.color)} />
                )}
                {option.icon}
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
