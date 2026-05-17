import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Skeleton as PrimitiveSkeleton } from "../primitives/skeleton";

export function Skeleton({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <PrimitiveSkeleton aria-hidden className={cn(className)} {...rest} />;
}
