/**
 * Bootstraps the in-memory backend with seed data and request handlers
 * for every feature module. Real backends would be swapped here at the
 * HttpClient.configure() level — services are agnostic.
 */
import { installMockBackend, registerHandler, MockError } from "./MockBackend";
import { API_BASE } from "../../../config/env";

// ---- Types ----
export type MockUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  plan: "free" | "pro" | "studio";
};
export type MockConversation = {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
};
export type MockMessageAttachment = {
  id: string;
  type: "image" | "gif" | "video";
  url: string;
  name: string;
  mimeType: string;
};
export type MockMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  sentAt: string;
  attachments?: MockMessageAttachment[];
};
export type MockNotification = {
  id: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
  type: "system" | "message" | "billing" | "follower";
};
export type MockInvoice = {
  id: string;
  amountCents: number;
  status: "paid" | "due" | "failed";
  issuedAt: string;
};

// ---- Seed ----
const now = Date.now();
const iso = (offsetMin: number) => new Date(now - offsetMin * 60_000).toISOString();

const currentUser: MockUser = {
  id: "u_me",
  email: "alex@creator.studio",
  name: "Alex Morgan",
  avatarUrl: null,
  plan: "pro",
};

const conversations: MockConversation[] = [
  { id: "c_1", participantId: "u_1", participantName: "Maya Chen", lastMessage: "Loved the latest drop 🔥", lastMessageAt: iso(4), unread: 2 },
  { id: "c_2", participantId: "u_2", participantName: "Devon Park", lastMessage: "When is the next stream?", lastMessageAt: iso(28), unread: 0 },
  { id: "c_3", participantId: "u_3", participantName: "Priya Raman", lastMessage: "Can I get the PDF version?", lastMessageAt: iso(120), unread: 1 },
  { id: "c_4", participantId: "u_4", participantName: "Jordan Lee", lastMessage: "Just renewed Studio plan ✨", lastMessageAt: iso(360), unread: 0 },
  { id: "c_5", participantId: "u_5", participantName: "Sam Becker", lastMessage: "Sent over the brief", lastMessageAt: iso(1440), unread: 0 },
];

const messages: MockMessage[] = [
  { id: "m_1", conversationId: "c_1", senderId: "u_1", text: "Hey! Loved the latest drop 🔥", sentAt: iso(8) },
  { id: "m_2", conversationId: "c_1", senderId: "u_me", text: "Thanks Maya — more coming next week.", sentAt: iso(7) },
  {
    id: "m_2b",
    conversationId: "c_1",
    senderId: "u_me",
    text: "",
    sentAt: iso(6),
    attachments: [
      {
        id: "a_seed_1",
        type: "image",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
        name: "preview.jpg",
        mimeType: "image/jpeg",
      },
    ],
  },
  { id: "m_3", conversationId: "c_1", senderId: "u_1", text: "Will you ship the source files?", sentAt: iso(5) },
  { id: "m_4", conversationId: "c_1", senderId: "u_1", text: "No rush, just wishful thinking 😄", sentAt: iso(4) },
  { id: "m_5", conversationId: "c_2", senderId: "u_2", text: "When is the next stream?", sentAt: iso(28) },
  { id: "m_6", conversationId: "c_3", senderId: "u_3", text: "Can I get the PDF version?", sentAt: iso(120) },
  { id: "m_7", conversationId: "c_4", senderId: "u_4", text: "Hey Alex — thinking about upgrading.", sentAt: iso(370) },
  { id: "m_8", conversationId: "c_4", senderId: "u_me", text: "Studio is a great fit if you need team seats.", sentAt: iso(365) },
  { id: "m_9", conversationId: "c_4", senderId: "u_4", text: "Just renewed Studio plan ✨", sentAt: iso(360) },
  { id: "m_10", conversationId: "c_5", senderId: "u_5", text: "Hi! Working on a collab pitch.", sentAt: iso(1450) },
  { id: "m_11", conversationId: "c_5", senderId: "u_me", text: "Sounds good — send it over when ready.", sentAt: iso(1445) },
  { id: "m_12", conversationId: "c_5", senderId: "u_5", text: "Sent over the brief", sentAt: iso(1440) },
];

const notifications: MockNotification[] = [
  { id: "n_1", title: "New follower", description: "Maya Chen started following you", read: false, createdAt: iso(2), type: "follower" },
  { id: "n_2", title: "Payout processed", description: "$2,450.00 sent to your bank", read: false, createdAt: iso(60), type: "billing" },
  { id: "n_3", title: "New message", description: "Priya Raman sent you a message", read: true, createdAt: iso(140), type: "message" },
  { id: "n_4", title: "Plan renewed", description: "Pro plan renewed for $29/mo", read: true, createdAt: iso(60 * 24 * 6), type: "billing" },
];

const invoices: MockInvoice[] = [
  { id: "inv_001", amountCents: 2900, status: "paid", issuedAt: iso(60 * 24 * 6) },
  { id: "inv_002", amountCents: 2900, status: "paid", issuedAt: iso(60 * 24 * 36) },
  { id: "inv_003", amountCents: 2900, status: "paid", issuedAt: iso(60 * 24 * 66) },
  { id: "inv_004", amountCents: 2900, status: "due", issuedAt: iso(60 * 24 * 0) },
];

function formatMockLastMessage(
  text: string,
  attachments: MockMessageAttachment[],
): string {
  if (text && attachments.length > 0) {
    const label =
      attachments.length === 1
        ? attachments[0]!.type === "video"
          ? "Video"
          : attachments[0]!.type === "gif"
            ? "GIF"
            : "Photo"
        : `${attachments.length} attachments`;
    return `${text} · ${label}`;
  }
  if (text) return text;
  if (attachments.length === 1) {
    const t = attachments[0]!.type;
    return t === "video" ? "Video" : t === "gif" ? "GIF" : "Photo";
  }
  return `${attachments.length} attachments`;
}

// ---- Handlers ----
function registerAll() {
  const path = (p: string) => new RegExp(`^${p.replace(/\//g, "\\/")}$`);

  // Auth
  registerHandler("POST", path("/auth/login"), ({ body }) => {
    const { email } = (body ?? {}) as { email?: string; password?: string };
    if (!email) throw new MockError(400, "Email required");
    return { token: "mock.jwt.token", user: { ...currentUser, email } };
  });
  registerHandler("POST", path("/auth/register"), ({ body }) => {
    const { email, name } = (body ?? {}) as { email?: string; name?: string };
    if (!email || !name) throw new MockError(400, "Missing fields");
    return { token: "mock.jwt.token", user: { ...currentUser, email, name } };
  });
  registerHandler("POST", path("/auth/forgot-password"), () => ({ ok: true }));
  registerHandler("GET", path("/auth/me"), () => currentUser);

  // Dashboard
  registerHandler("GET", path("/dashboard/stats"), () => ({
    revenueCents: 1284200,
    revenueDelta: 12.4,
    subscribers: 3482,
    subscribersDelta: 4.8,
    posts: 47,
    postsDelta: 8.1,
    engagement: 68.2,
    engagementDelta: -1.2,
  }));
  registerHandler("GET", path("/dashboard/revenue"), () => {
    const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((m, i) => ({
      month: m,
      revenue: 6200 + i * 980 + Math.round(Math.sin(i) * 400),
    }));
  });
  registerHandler("GET", path("/dashboard/activity"), () => [
    { id: "a_1", actor: "Maya Chen", action: "subscribed to your Pro tier", at: iso(3) },
    { id: "a_2", actor: "Devon Park", action: "commented on “Designing for trust”", at: iso(22) },
    { id: "a_3", actor: "Priya Raman", action: "purchased your template pack", at: iso(80) },
    { id: "a_4", actor: "Jordan Lee", action: "upgraded to Studio plan", at: iso(180) },
    { id: "a_5", actor: "Sam Becker", action: "left a 5★ review", at: iso(420) },
  ]);

  // Messaging
  registerHandler("GET", path("/messaging/conversations"), () => conversations);
  registerHandler(
    "GET",
    /^\/messaging\/conversations\/[^/]+\/messages$/,
    ({ url }) => {
      const id = url.pathname.split("/")[3];
      return messages.filter((m) => m.conversationId === id);
    },
  );
  registerHandler(
    "POST",
    /^\/messaging\/conversations\/[^/]+\/read$/,
    ({ url }) => {
      const id = url.pathname.split("/")[3];
      const conv = conversations.find((c) => c.id === id);
      if (!conv) throw new MockError(404, "Conversation not found");
      conv.unread = 0;
      return conv;
    },
  );
  registerHandler(
    "POST",
    /^\/messaging\/conversations\/[^/]+\/messages$/,
    ({ url, body }) => {
      const id = url.pathname.split("/")[3];
      const payload = (body ?? {}) as {
        text?: string;
        attachments?: Array<Omit<MockMessageAttachment, "id">>;
      };
      const text = payload.text?.trim() ?? "";
      const rawAttachments = payload.attachments ?? [];
      if (!text && rawAttachments.length === 0) {
        throw new MockError(400, "Empty message");
      }
      const attachments = rawAttachments.map((a, i) => ({
        ...a,
        id: `a_${Date.now()}_${i}`,
      }));
      const msg: MockMessage = {
        id: `m_${Date.now()}`,
        conversationId: id,
        senderId: "u_me",
        text,
        sentAt: new Date().toISOString(),
        ...(attachments.length > 0 ? { attachments } : {}),
      };
      messages.push(msg);
      const conv = conversations.find((c) => c.id === id);
      if (conv) {
        conv.lastMessage = formatMockLastMessage(text, attachments);
        conv.lastMessageAt = msg.sentAt;
      }
      return msg;
    },
  );

  // Notifications
  registerHandler("GET", path("/notifications"), () => notifications);
  registerHandler("POST", path("/notifications/read-all"), () => {
    notifications.forEach((n) => (n.read = true));
    return { ok: true };
  });
  registerHandler("POST", /^\/notifications\/[^/]+\/read$/, ({ url }) => {
    const id = url.pathname.split("/")[2];
    const n = notifications.find((x) => x.id === id);
    if (n) n.read = true;
    return { ok: true };
  });

  // Analytics
  registerHandler("GET", path("/analytics/overview"), () => {
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now - (13 - i) * 86_400_000);
      return {
        day: d.toISOString().slice(5, 10),
        views: 1200 + Math.round(Math.sin(i / 2) * 400) + i * 60,
        signups: 18 + Math.round(Math.cos(i / 2) * 6) + Math.round(i / 2),
      };
    });
    return { series: days, topSources: [
      { source: "Direct", visits: 8421 },
      { source: "Twitter / X", visits: 5210 },
      { source: "Newsletter", visits: 3122 },
      { source: "Search", visits: 2104 },
      { source: "Referrals", visits: 1488 },
    ]};
  });

  // Subscription
  registerHandler("GET", path("/subscription/plans"), () => [
    { id: "free", name: "Free", priceCents: 0, features: ["Up to 100 subscribers", "Basic analytics", "Community support"] },
    { id: "pro", name: "Pro", priceCents: 2900, features: ["Unlimited subscribers", "Advanced analytics", "Priority support", "Custom domain"] },
    { id: "studio", name: "Studio", priceCents: 9900, features: ["Everything in Pro", "Team seats", "API access", "Dedicated CSM"] },
  ]);
  registerHandler("GET", path("/subscription/current"), () => ({
    planId: currentUser.plan,
    renewsAt: iso(-60 * 24 * 24),
    status: "active",
  }));
  registerHandler("GET", path("/subscription/invoices"), () => invoices);
}

export function bootstrapMockBackend() {
  installMockBackend();
  registerAll();
  // Configure HttpClient base URL once
  import("./HttpClient").then(({ HttpClient }) =>
    HttpClient.configure({ baseUrl: API_BASE }),
  );
}
