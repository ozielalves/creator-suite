import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { Suspense, useEffect, useState } from "react";

import appCss from "../styles.css?url";
import { SwrProvider } from "@/modules/Common/providers/SwrProvider";
import { ThemeProvider } from "@/modules/Common/providers/ThemeProvider";
import { THEME_INIT_SCRIPT } from "@/modules/Common/hooks/useThemeStore";
import { AuthGate } from "@/modules/Auth";
import { Spinner } from "@/modules/UI";
import { bootstrapMockBackend } from "@/modules/Common/services/bootstrap";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Creator Studio" },
      { name: "description", content: "Modern platform for independent creators." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/assets/logo-oziel.svg", type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [ready, setReady] = useState(false);

  // Install in-memory backend once on the client.
  useEffect(() => {
    bootstrapMockBackend();
    setReady(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SwrProvider>
          {ready ? (
            <AuthGate>
              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <Spinner size="lg" />
                  </div>
                }
              >
                <Outlet />
              </Suspense>
            </AuthGate>
          ) : (
            <div className="min-h-screen" />
          )}
        </SwrProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
