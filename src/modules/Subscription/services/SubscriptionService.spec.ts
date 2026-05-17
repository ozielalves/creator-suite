import { describe, it, expect, vi, beforeEach } from "vitest";

const httpMock = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("@/modules/Common/services/HttpClient", () => ({
  HttpClient: httpMock,
}));

import { SubscriptionService } from "./SubscriptionService";

describe("SubscriptionService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches plans", async () => {
    const plans = [{ id: "pro", name: "Pro", priceCents: 2900, features: [] }];
    httpMock.get.mockResolvedValue(plans);

    await expect(SubscriptionService.plans()).resolves.toEqual(plans);
    expect(httpMock.get).toHaveBeenCalledWith("/subscription/plans");
  });

  it("fetches current subscription", async () => {
    const current = { planId: "pro", renewsAt: "soon", status: "active" };
    httpMock.get.mockResolvedValue(current);

    await expect(SubscriptionService.current()).resolves.toEqual(current);
    expect(httpMock.get).toHaveBeenCalledWith("/subscription/current");
  });

  it("fetches invoices", async () => {
    const invoices = [
      { id: "inv_1", amountCents: 2900, status: "paid", issuedAt: "now" },
    ];
    httpMock.get.mockResolvedValue(invoices);

    await expect(SubscriptionService.invoices()).resolves.toEqual(invoices);
    expect(httpMock.get).toHaveBeenCalledWith("/subscription/invoices");
  });
});
