import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Spinner } from "@/modules/UI";

const NotificationsPage = lazy(() =>
  import("@/modules/Notifications").then((m) => ({ default: m.NotificationsPage })),
);

export const Route = createFileRoute("/_app/notifications")({
  component: () => (
    <Suspense fallback={<Spinner />}>
      <NotificationsPage />
    </Suspense>
  ),
});
