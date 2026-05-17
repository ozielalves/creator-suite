import { describe, it, expect, vi, beforeEach } from "vitest";

const httpMock = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));

vi.mock("@/modules/Common/services/HttpClient", () => ({
  HttpClient: httpMock,
}));

import { NotificationsService } from "./NotificationsService";

describe("NotificationsService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("lists notifications", async () => {
    const notifications = [
      {
        id: "n_1",
        title: "New follower",
        description: "Maya followed you",
        read: false,
        createdAt: "now",
        type: "follower" as const,
      },
    ];
    httpMock.get.mockResolvedValue(notifications);

    await expect(NotificationsService.list()).resolves.toEqual(notifications);
    expect(httpMock.get).toHaveBeenCalledWith("/notifications");
  });

  it("marks all notifications as read", async () => {
    httpMock.post.mockResolvedValue({ ok: true });
    await NotificationsService.markAllRead();
    expect(httpMock.post).toHaveBeenCalledWith("/notifications/read-all");
  });

  it("marks a single notification as read", async () => {
    httpMock.post.mockResolvedValue({ ok: true });
    await NotificationsService.markRead("n_1");
    expect(httpMock.post).toHaveBeenCalledWith("/notifications/n_1/read");
  });
});
