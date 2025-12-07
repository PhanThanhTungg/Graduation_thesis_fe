import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface OptionItemProps {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isCheckbox?: boolean;
}

export function OptionItem({
  label,
  selected,
  disabled,
  onClick,
  isCheckbox,
}: OptionItemProps) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={cn(
        "flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer",
        selected
          ? "border-orange bg-orange/10 ring-2 ring-orange/30"
          : "hover:border-orange/50",
        disabled && "opacity-60 cursor-not-allowed",
      )}
    >
      {isCheckbox ? (
        // Checkbox style for multiple choice
        <div
          className={cn(
            "w-6 h-6 rounded-md border-2 transition-colors flex items-center justify-center",
            selected ? "border-orange bg-orange" : "border-muted-foreground/30",
          )}
        >
          {selected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
        </div>
      ) : (
        // Radio button style for single choice
        <div
          className={cn(
            "w-6 h-6 rounded-full border-2 transition-colors flex items-center justify-center",
            selected ? "border-orange bg-orange" : "border-muted-foreground/30",
          )}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
        </div>
      )}
      <Label
        className={cn(
          "flex-1 cursor-pointer font-normal",
          disabled && "cursor-not-allowed",
        )}
      >
        {label}
      </Label>
    </div>
  );
}
