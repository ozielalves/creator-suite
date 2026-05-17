import { cn } from "@/lib/utils";

export function Spinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = { sm: "h-3.5 w-3.5", md: "h-5 w-5", lg: "h-8 w-8" };
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        sizes[size],
        className,
      )}
    />
  );
}
