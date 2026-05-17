import { describe, it, expect, vi, beforeEach } from "vitest";
import { API_BASE } from "@/config/env";

describe("bootstrapMockBackend", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("registers feature handlers for auth and dashboard", async () => {
    const { bootstrapMockBackend } = await import("./bootstrap");
    const { HttpClient } = await import("./HttpClient");

    bootstrapMockBackend();
    HttpClient.configure({ baseUrl: API_BASE });

    const login = await HttpClient.post<{ token: string }>("/auth/login", {
      email: "test@example.com",
      password: "secret",
    });
    expect(login.token).toBe("mock.jwt.token");

    const stats = await HttpClient.get<{ subscribers: number }>("/dashboard/stats");
    expect(stats.subscribers).toBeGreaterThan(0);
  });
});
