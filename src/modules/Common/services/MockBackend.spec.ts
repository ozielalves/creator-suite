import { describe, it, expect, vi, beforeEach } from "vitest";
import { API_BASE } from "@/config/env";

describe("MockBackend", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("passthrough", { status: 200 })),
    );
  });

  it("intercepts requests under API_BASE", async () => {
    const { installMockBackend, registerHandler } = await import("./MockBackend");
    registerHandler("GET", /^\/hello$/, () => ({ message: "hi" }));
    installMockBackend();

    const res = await fetch(`${API_BASE}/hello`);
    const body = await res.json();
    expect(body).toEqual({ message: "hi" });
  });

  it("returns 404 when no handler matches", async () => {
    const { installMockBackend } = await import("./MockBackend");
    installMockBackend();

    const res = await fetch(`${API_BASE}/missing`);
    expect(res.status).toBe(404);
  });

  it("forwards non-API URLs to original fetch", async () => {
    const original = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", original);

    const { installMockBackend } = await import("./MockBackend");
    installMockBackend();

    await fetch("https://example.com/other");
    expect(original).toHaveBeenCalled();
  });

  it("maps MockError to error responses", async () => {
    const { installMockBackend, registerHandler, MockError } = await import(
      "./MockBackend"
    );
    registerHandler("POST", /^\/fail$/, () => {
      throw new MockError(400, "Bad input");
    });
    installMockBackend();

    const res = await fetch(`${API_BASE}/fail`, { method: "POST" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: "Bad input" });
  });
});
