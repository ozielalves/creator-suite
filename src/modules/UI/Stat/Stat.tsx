import type { ReactNode } from "react";
import { Card } from "../Card/Card";
import { Skeleton } from "../Skeleton/Skeleton";
import { cn } from "@/lib/utils";

export interface StatProps {
  label: string;
  value: string | number;
  delta?: number;
  icon?: ReactNode;
  isLoading?: boolean;
}

export function Stat({ label, value, delta, icon, isLoading }: StatProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {icon && (
          <span className="text-muted-foreground" aria-hidden>
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        {isLoading ? (
          <Skeleton className="h-7 w-24" />
        ) : (
          <span className="text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </span>
        )}
        {delta !== undefined && !isLoading && (
          <span
            className={cn(
              "text-xs font-medium",
              delta >= 0 ? "text-success" : "text-destructive",
            )}
          >
            {delta >= 0 ? "+" : ""}
            {delta}%
          </span>
        )}
      </div>
    </Card>
  );
}
