import useSWR from "swr";
import {
  MessagingService,
  type Conversation,
  type Message,
} from "../services/MessagingService";

export const useConversations = () =>
  useSWR<Conversation[]>("/messaging/conversations", () => MessagingService.list());

export const useMessages = (conversationId: string | null) =>
  useSWR<Message[]>(
    conversationId ? `/messaging/conversations/${conversationId}/messages` : null,
    () => MessagingService.messages(conversationId!),
    { refreshInterval: 5000 },
  );
