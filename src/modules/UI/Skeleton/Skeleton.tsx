import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Skeleton({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...rest}
    />
  );
}
