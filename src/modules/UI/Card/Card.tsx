import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import {
  Card as PrimitiveCard,
  CardContent as PrimitiveCardContent,
  CardDescription as PrimitiveCardDescription,
  CardFooter as PrimitiveCardFooter,
  CardHeader as PrimitiveCardHeader,
} from "../primitives/card";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <PrimitiveCard
      ref={ref}
      className={cn(
        "bg-surface text-surface-foreground border-border shadow-[var(--shadow-elevation-1)]",
        className,
      )}
      {...rest}
    />
  ),
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <PrimitiveCardHeader
      ref={ref}
      className={cn("p-5 border-b border-border space-y-0", className)}
      {...rest}
    />
  ),
);
CardHeader.displayName = "CardHeader";

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-semibold tracking-tight", className)} {...rest} />;
}

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...rest }, ref) => (
  <PrimitiveCardDescription
    ref={ref}
    className={cn("text-sm text-muted-foreground mt-1", className)}
    {...rest}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <PrimitiveCardContent ref={ref} className={cn("p-5", className)} {...rest} />
  ),
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <PrimitiveCardFooter
      ref={ref}
      className={cn("p-5 border-t border-border", className)}
      {...rest}
    />
  ),
);
CardFooter.displayName = "CardFooter";
