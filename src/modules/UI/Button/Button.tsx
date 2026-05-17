import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Button as PrimitiveButton } from "../primitives/button";
import { Spinner } from "../Spinner/Spinner";
import type { ButtonProps, ButtonSize, ButtonVariant } from "./Button.types";

const VARIANT: Record<ButtonVariant, "default" | "secondary" | "ghost" | "destructive" | "outline"> =
  {
    primary: "default",
    secondary: "secondary",
    ghost: "ghost",
    destructive: "destructive",
    outline: "outline",
  };

const SIZE: Record<ButtonSize, "default" | "sm" | "lg" | "icon"> = {
  sm: "sm",
  md: "default",
  lg: "lg",
  icon: "icon",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth,
      className,
      children,
      disabled,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    return (
      <PrimitiveButton
        ref={ref}
        type={type}
        variant={VARIANT[variant]}
        size={SIZE[size]}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(
          "rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          fullWidth && "w-full",
          className,
        )}
        {...rest}
      >
        {isLoading ? (
          <Spinner size="sm" />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </PrimitiveButton>
    );
  },
);
Button.displayName = "Button";

export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button.types";
