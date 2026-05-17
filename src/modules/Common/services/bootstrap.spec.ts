import { describe, it, expect, vi, beforeEach } from "vitest";
import { API_BASE, DEMO_LOGIN_EMAIL, DEMO_LOGIN_PASSWORD } from "@/config/env";

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
      email: DEMO_LOGIN_EMAIL,
      password: DEMO_LOGIN_PASSWORD,
    });
    expect(login.token).toBe("mock.jwt.token");

    await expect(
      HttpClient.post("/auth/login", {
        email: DEMO_LOGIN_EMAIL,
        password: "wrong",
      }),
    ).rejects.toMatchObject({ status: 401 });

    const stats = await HttpClient.get<{ subscribers: number }>("/dashboard/stats");
    expect(stats.subscribers).toBeGreaterThan(0);
  });
});
