import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Bell,
  CreditCard,
  LogOut,
} from "lucide-react";
import type { ReactNode } from "react";
import { useAuthStore } from "@/modules/Auth";
import { Avatar } from "@/modules/UI";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/config/env";
import { ThemeToggle } from "./ThemeToggle";

type NavItem = {
  to: "/dashboard" | "/messaging" | "/analytics" | "/notifications" | "/subscription";
  label: string;
  icon: typeof LayoutDashboard;
};

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/messaging", label: "Messaging", icon: MessageSquare },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/subscription", label: "Subscription", icon: CreditCard },
];

export function AppShell({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { pathname } = useRouterState({ select: (s) => s.location });

  return (
    <div className="min-h-screen flex">
      <aside
        aria-label="Primary"
        className="hidden md:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              C
            </div>
            <span className="font-semibold tracking-tight text-sm">{APP_NAME}</span>
          </div>
          <ThemeToggle />
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="flex flex-col gap-0.5">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      "hover:bg-sidebar-accent",
                      active
                        ? "bg-sidebar-accent text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar name={user?.name ?? "Guest"} src={user?.avatarUrl} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name ?? "Guest"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav />
        <main className="flex-1 px-4 sm:px-6 md:px-10 py-6 md:py-10 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function MobileNav() {
  const { pathname } = useRouterState({ select: (s) => s.location });
  return (
    <div className="md:hidden sticky top-0 z-10 bg-sidebar/90 backdrop-blur border-b border-sidebar-border">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
            C
          </div>
          <span className="text-sm font-semibold">{APP_NAME}</span>
        </div>
        <ThemeToggle />
      </div>
      <nav className="overflow-x-auto px-3 pb-2">
        <ul className="flex items-center gap-1 min-w-max">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
