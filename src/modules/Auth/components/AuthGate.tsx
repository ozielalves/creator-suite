import { useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuthStore } from "../hooks/useAuthStore";
import { LOGIN_ROUTE } from "../constants";

/**
 * Bootstraps auth state once and redirects unauthenticated users away
 * from protected paths. Public auth routes are whitelisted.
 */
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

export function AuthGate({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useRouterState({ select: (s) => s.location });
  const status = useAuthStore((s) => s.status);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    if (status === "idle") void hydrate();
  }, [status, hydrate]);

  useEffect(() => {
    if (status === "unauthenticated" && !PUBLIC_ROUTES.includes(pathname)) {
      navigate({ to: LOGIN_ROUTE });
    }
  }, [status, pathname, navigate]);

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isResolving = status === "idle" || status === "loading";
  if (!isPublic && (isResolving || status === "unauthenticated")) {
    return null;
  }

  return <>{children}</>;
}
