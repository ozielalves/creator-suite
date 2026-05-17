/**
 * MockBackend — in-memory data + fetch interception.
 *
 * Wraps window.fetch once at app boot. Any request whose URL starts with
 * `${API_BASE}` is resolved against the in-memory store with a small
 * artificial latency to mimic real network behavior.
 *
 * This lets the entire Service → HttpClient → API flow stay real while we
 * iterate on the front-end without a backend.
 */

import { API_BASE, NETWORK_LATENCY_MS } from "../../../config/env";

type Handler = (req: { url: URL; method: string; body: unknown }) =>
  | Promise<unknown>
  | unknown;

const handlers: Array<{ method: string; pattern: RegExp; handler: Handler }> = [];

export function registerHandler(method: string, pattern: RegExp, handler: Handler) {
  handlers.push({ method, pattern, handler });
}

let installed = false;
export function installMockBackend() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  const original = window.fetch.bind(window);

  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const urlString =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    if (!urlString.startsWith(API_BASE)) return original(input, init);

    const url = new URL(urlString);
    const method = (init?.method ?? "GET").toUpperCase();
    const bodyRaw = init?.body;
    let body: unknown = undefined;
    if (typeof bodyRaw === "string") {
      try {
        body = JSON.parse(bodyRaw);
      } catch {
        body = bodyRaw;
      }
    }

    const match = handlers.find(
      (h) => h.method === method && h.pattern.test(url.pathname),
    );

    await new Promise((r) => setTimeout(r, NETWORK_LATENCY_MS));

    if (!match) {
      return new Response(JSON.stringify({ message: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const result = await match.handler({ url, method, body });
      return new Response(JSON.stringify(result ?? null), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      const status = (err as { status?: number })?.status ?? 500;
      const message = (err as Error)?.message ?? "Server error";
      return new Response(JSON.stringify({ message }), {
        status,
        headers: { "Content-Type": "application/json" },
      });
    }
  }) as typeof window.fetch;
}

export class MockError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
