import { PenLineIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
};

export function BrandLogo({
  className,
  markClassName,
}: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative flex size-10 items-center justify-center rounded-xl border bg-primary text-primary-foreground shadow-sm",
          "before:absolute before:inset-0 before:rounded-xl before:bg-[linear-gradient(135deg,rgba(255,255,255,0.28),transparent_55%)]",
          markClassName,
        )}
      >
        <PenLineIcon className="relative size-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-lg font-semibold leading-none tracking-tight">
          StoryGrid
        </p>
      </div>
    </div>
  );
}
