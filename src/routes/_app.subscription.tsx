import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Spinner } from "@/modules/UI";

const SubscriptionPage = lazy(() =>
  import("@/modules/Subscription").then((m) => ({ default: m.SubscriptionPage })),
);

export const Route = createFileRoute("/_app/subscription")({
  component: () => (
    <Suspense fallback={<Spinner />}>
      <SubscriptionPage />
    </Suspense>
  ),
});
