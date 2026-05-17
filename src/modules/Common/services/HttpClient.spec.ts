import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { HttpClient, HttpError } from "./HttpClient";

describe("HttpClient", () => {
  beforeEach(() => {
    HttpClient.configure({ baseUrl: "https://api.test" });
    HttpClient.setAuthToken(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("performs GET and parses JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    const data = await HttpClient.get<{ ok: boolean }>("/items");
    expect(data).toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledWith(
      "https://api.test/items",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("sends Authorization header when token is set", async () => {
    HttpClient.setAuthToken("secret");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({}), { status: 200 }),
      ),
    );

    await HttpClient.get("/me");
    const init = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer secret",
    );
  });

  it("throws HttpError on non-ok responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(
        () =>
          new Response(JSON.stringify({ message: "Nope" }), {
            status: 422,
            statusText: "Unprocessable",
          }),
      ),
    );

    await expect(HttpClient.get("/fail")).rejects.toMatchObject({
      status: 422,
      body: { message: "Nope" },
    });
  });

  it("retries failed requests", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const data = await HttpClient.get("/retry", { retries: 1 });
    expect(data).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("runs request and response interceptors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      ),
    );

    HttpClient.addRequestInterceptor((_url, init) => ({
      ...init,
      headers: { ...(init.headers as Record<string, string>), "X-Test": "1" },
    }));
    HttpClient.addResponseInterceptor(async (res) => {
      const clone = res.clone();
      const headers = new Headers(clone.headers);
      headers.set("X-Seen", "yes");
      return new Response(await clone.text(), { status: clone.status, headers });
    });

    await HttpClient.get("/intercepted");
    const init = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>)["X-Test"]).toBe("1");
  });
});
