import { describe, it, expect, vi, beforeEach } from "vitest";

const httpMock = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));

vi.mock("@/modules/Common/services/HttpClient", () => ({
  HttpClient: httpMock,
}));

import { MessagingService } from "./MessagingService";

describe("MessagingService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("lists conversations", async () => {
    const conversations = [
      {
        id: "c_1",
        participantId: "u_1",
        participantName: "Maya",
        lastMessage: "Hi",
        lastMessageAt: "now",
        unread: 0,
      },
    ];
    httpMock.get.mockResolvedValue(conversations);

    await expect(MessagingService.list()).resolves.toEqual(conversations);
    expect(httpMock.get).toHaveBeenCalledWith("/messaging/conversations");
  });

  it("loads messages for a conversation", async () => {
    const messages = [
      {
        id: "m_1",
        conversationId: "c_1",
        senderId: "u_1",
        text: "Hello",
        sentAt: "now",
      },
    ];
    httpMock.get.mockResolvedValue(messages);

    await expect(MessagingService.messages("c_1")).resolves.toEqual(messages);
    expect(httpMock.get).toHaveBeenCalledWith("/messaging/conversations/c_1/messages");
  });

  it("sends a message", async () => {
    const message = {
      id: "m_2",
      conversationId: "c_1",
      senderId: "u_me",
      text: "Reply",
      sentAt: "now",
    };
    httpMock.post.mockResolvedValue(message);

    await expect(MessagingService.send("c_1", "Reply")).resolves.toEqual(message);
    expect(httpMock.post).toHaveBeenCalledWith(
      "/messaging/conversations/c_1/messages",
      { text: "Reply" },
    );
  });
});
