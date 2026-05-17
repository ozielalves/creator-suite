import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "primary" | "success" | "warning" | "destructive";

const TONE: Record<BadgeTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-accent text-accent-foreground",
  success: "bg-[color-mix(in_oklab,var(--success)_18%,transparent)] text-success",
  warning: "bg-[color-mix(in_oklab,var(--warning)_22%,transparent)] text-warning-foreground",
  destructive:
    "bg-[color-mix(in_oklab,var(--destructive)_15%,transparent)] text-destructive",
};

export function Badge({
  tone = "neutral",
  className,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        TONE[tone],
        className,
      )}
      {...rest}
    />
  );
}
