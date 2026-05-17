import { cn } from "@/lib/utils";
import { AvatarFallback, Avatar as PrimitiveAvatar } from "../primitives/avatar";

export type AvatarProps = {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
};

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <PrimitiveAvatar
      role="img"
      aria-label={name}
      className={cn(
        "bg-accent text-accent-foreground font-medium",
        SIZE[size],
        className,
      )}
    >
      {src ? (
        <img src={src} alt="" className="aspect-square h-full w-full object-cover" />
      ) : (
        <AvatarFallback className="bg-accent text-accent-foreground">{initials}</AvatarFallback>
      )}
    </PrimitiveAvatar>
  );
}
