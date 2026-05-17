import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Badge as PrimitiveBadge } from "../primitives/badge";

export type BadgeTone = "neutral" | "primary" | "success" | "warning" | "destructive";

const TONE: Record<BadgeTone, string> = {
  neutral: "rounded-full border-transparent bg-muted text-muted-foreground hover:bg-muted",
  primary:
    "rounded-full border-transparent bg-accent text-accent-foreground hover:bg-accent",
  success:
    "rounded-full border-transparent bg-[color-mix(in_oklab,var(--success)_18%,transparent)] text-success hover:bg-[color-mix(in_oklab,var(--success)_18%,transparent)]",
  warning:
    "rounded-full border-transparent bg-[color-mix(in_oklab,var(--warning)_22%,transparent)] text-warning-foreground hover:bg-[color-mix(in_oklab,var(--warning)_22%,transparent)]",
  destructive:
    "rounded-full border-transparent bg-[color-mix(in_oklab,var(--destructive)_15%,transparent)] text-destructive hover:bg-[color-mix(in_oklab,var(--destructive)_15%,transparent)]",
};

export function Badge({
  tone = "neutral",
  className,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <PrimitiveBadge
      className={cn("px-2 py-0.5 text-[11px] font-medium", TONE[tone], className)}
      {...rest}
    />
  );
}
