export type MessageMediaType = "image" | "gif" | "video";

export type MessageAttachment = {
  id: string;
  type: MessageMediaType;
  url: string;
  name: string;
  mimeType: string;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  sentAt: string;
  attachments?: MessageAttachment[];
};

export type Conversation = {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
};

export type SendMessagePayload = {
  text?: string;
  attachments?: Omit<MessageAttachment, "id">[];
};
