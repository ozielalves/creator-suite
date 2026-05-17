import * as SwitchPrimitives from "@radix-ui/react-switch";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "../hooks/useThemeStore";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const isDark = theme === "dark";

  return (
    <SwitchPrimitives.Root
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      aria-label="Toggle dark mode"
      className={cn(
        "relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full",
        "border-2 border-transparent shadow-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted",
        className,
      )}
    >
      <Sun
        className={cn(
          "absolute left-1 h-2.5 w-2.5 pointer-events-none transition-opacity",
          isDark ? "text-primary-foreground/35" : "text-foreground/60",
        )}
        aria-hidden
      />
      <Moon
        className={cn(
          "absolute right-1 h-2.5 w-2.5 pointer-events-none transition-opacity",
          isDark ? "text-primary-foreground" : "text-muted-foreground/40",
        )}
        aria-hidden
      />
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none z-10 flex h-4 w-4 items-center justify-center rounded-full",
          "bg-background shadow-sm ring-0 transition-transform",
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5",
        )}
      >
        {isDark ? (
          <Moon className="h-2.5 w-2.5 text-foreground" aria-hidden />
        ) : (
          <Sun className="h-2.5 w-2.5 text-foreground" aria-hidden />
        )}
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
}
