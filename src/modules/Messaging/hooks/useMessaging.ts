import useSWR from "swr";
import { MessagingService } from "../services/MessagingService";
import type { Conversation, Message } from "../types";

export const useConversations = () =>
  useSWR<Conversation[]>("/messaging/conversations", () => MessagingService.list());

export const useMessages = (conversationId: string | null) =>
  useSWR<Message[]>(
    conversationId ? `/messaging/conversations/${conversationId}/messages` : null,
    () => MessagingService.messages(conversationId!),
    { refreshInterval: 5000 },
  );
