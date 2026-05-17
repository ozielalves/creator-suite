import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Spinner } from "@/modules/UI";

const AnalyticsPage = lazy(() =>
  import("@/modules/Analytics").then((m) => ({ default: m.AnalyticsPage })),
);

export const Route = createFileRoute("/_app/analytics")({
  component: () => (
    <Suspense fallback={<Spinner />}>
      <AnalyticsPage />
    </Suspense>
  ),
});
