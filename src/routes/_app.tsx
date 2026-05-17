import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/modules/Common/components/AppShell";

/**
 * Pathless layout wrapping every authenticated app surface in the AppShell.
 */
export const Route = createFileRoute("/_app")({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
