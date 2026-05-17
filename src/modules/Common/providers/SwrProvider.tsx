import { SWRConfig } from "swr";
import type { ReactNode } from "react";
import { HttpClient } from "../services/HttpClient";

/**
 * Global SWR provider. The fetcher delegates to HttpClient so every
 * server-state read goes through the same auth, retry, and error pipeline.
 */
export function SwrProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (key: string) => HttpClient.get(key),
        revalidateOnFocus: false,
        shouldRetryOnError: true,
        errorRetryCount: 1,
        dedupingInterval: 2000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
