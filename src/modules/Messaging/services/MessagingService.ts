import { HttpClient } from "@/modules/Common/services/HttpClient";

export type Conversation = {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
};
export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  sentAt: string;
};

class MessagingServiceImpl {
  list() {
    return HttpClient.get<Conversation[]>("/messaging/conversations");
  }
  messages(conversationId: string) {
    return HttpClient.get<Message[]>(
      `/messaging/conversations/${conversationId}/messages`,
    );
  }
  send(conversationId: string, text: string) {
    return HttpClient.post<Message>(
      `/messaging/conversations/${conversationId}/messages`,
      { text },
    );
  }
}
const messagingService = new MessagingServiceImpl();
export { messagingService as MessagingService };
