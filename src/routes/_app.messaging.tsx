import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Spinner } from "@/modules/UI";

const MessagingPage = lazy(() =>
  import("@/modules/Messaging").then((m) => ({ default: m.MessagingPage })),
);

export const Route = createFileRoute("/_app/messaging")({
  component: () => (
    <Suspense fallback={<Spinner />}>
      <MessagingPage />
    </Suspense>
  ),
});
