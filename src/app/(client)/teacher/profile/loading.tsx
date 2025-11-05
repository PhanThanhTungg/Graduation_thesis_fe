import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="container-lg py-12">
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-foreground" />
      </div>
    </div>
  );
}

