import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Spinner } from "@/modules/UI";

const DashboardPage = lazy(() =>
  import("@/modules/CreatorDashboard").then((m) => ({ default: m.DashboardPage })),
);

export const Route = createFileRoute("/_app/dashboard")({
  component: () => (
    <Suspense fallback={<Spinner />}>
      <DashboardPage />
    </Suspense>
  ),
});
