import { describe, it, expect, vi, beforeEach } from "vitest";

const httpMock = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("@/modules/Common/services/HttpClient", () => ({
  HttpClient: httpMock,
}));

import { DashboardService } from "./DashboardService";

describe("DashboardService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches dashboard stats", async () => {
    const stats = {
      revenueCents: 100,
      revenueDelta: 1,
      subscribers: 10,
      subscribersDelta: 2,
      posts: 3,
      postsDelta: 4,
      engagement: 50,
      engagementDelta: -1,
    };
    httpMock.get.mockResolvedValue(stats);

    await expect(DashboardService.getStats()).resolves.toEqual(stats);
    expect(httpMock.get).toHaveBeenCalledWith("/dashboard/stats");
  });

  it("fetches revenue series", async () => {
    const revenue = [{ month: "Jan", revenue: 1000 }];
    httpMock.get.mockResolvedValue(revenue);

    await expect(DashboardService.getRevenue()).resolves.toEqual(revenue);
    expect(httpMock.get).toHaveBeenCalledWith("/dashboard/revenue");
  });

  it("fetches recent activity", async () => {
    const activity = [{ id: "a_1", actor: "Maya", action: "joined", at: "now" }];
    httpMock.get.mockResolvedValue(activity);

    await expect(DashboardService.getActivity()).resolves.toEqual(activity);
    expect(httpMock.get).toHaveBeenCalledWith("/dashboard/activity");
  });
});
