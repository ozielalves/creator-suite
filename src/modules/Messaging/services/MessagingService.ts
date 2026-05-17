import { HttpClient } from "@/modules/Common/services/HttpClient";
import type {
  Conversation,
  Message,
  SendMessagePayload,
} from "../types";

export type { Conversation, Message, MessageAttachment, SendMessagePayload } from "../types";

class MessagingServiceImpl {
  list() {
    return HttpClient.get<Conversation[]>("/messaging/conversations");
  }
  messages(conversationId: string) {
    return HttpClient.get<Message[]>(
      `/messaging/conversations/${conversationId}/messages`,
    );
  }
  send(conversationId: string, payload: SendMessagePayload) {
    return HttpClient.post<Message>(
      `/messaging/conversations/${conversationId}/messages`,
      payload,
    );
  }
}
const messagingService = new MessagingServiceImpl();
export { messagingService as MessagingService };
