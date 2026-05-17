import { describe, it, expect, vi, beforeEach } from "vitest";

const httpMock = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("@/modules/Common/services/HttpClient", () => ({
  HttpClient: httpMock,
}));

import { AnalyticsService } from "./AnalyticsService";

describe("AnalyticsService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches analytics overview", async () => {
    const overview = {
      series: [{ day: "05-01", views: 100, signups: 5 }],
      topSources: [{ source: "Direct", visits: 100 }],
    };
    httpMock.get.mockResolvedValue(overview);

    await expect(AnalyticsService.overview()).resolves.toEqual(overview);
    expect(httpMock.get).toHaveBeenCalledWith("/analytics/overview");
  });
});
