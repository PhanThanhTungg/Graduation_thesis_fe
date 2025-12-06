import { Label } from "@/components/ui/label";

interface OptionItemProps {
  label: string;
}

export function OptionItem({ label }: OptionItemProps) {
  return (
    <div className="flex items-center space-x-3 p-4 rounded-lg border hover:border-orange/50 transition-colors">
      <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30" />
      <Label className="flex-1 cursor-pointer font-normal">{label}</Label>
    </div>
  );
}
