import { Gift } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary border-2 border-primary-foreground/30 ring-1 ring-primary/40">
        <Gift className="h-6 w-6 text-primary-foreground" strokeWidth={2} />
      </div>
        <span className="text-2xl font-bold tracking-tight text-foreground">
          GC
        </span>
    </div>
  );
}