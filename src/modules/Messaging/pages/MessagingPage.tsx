import { useEffect, useState } from "react";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useSWRConfig } from "swr";
import { Avatar, Button, Card, EmptyState, Skeleton } from "@/modules/UI";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatRelativeTime } from "@/modules/Common/utils/format";
import { MessageBubble } from "../components/MessageBubble";
import { MessageComposer } from "../components/MessageComposer";
import { useConversations, useMessages } from "../hooks/useMessaging";
import { MessagingService } from "../services/MessagingService";
import type { SendMessagePayload } from "../types";

export function MessagingPage() {
  const isMobile = useIsMobile();
  const { data: conversations, isLoading } = useConversations();
  const { mutate } = useSWRConfig();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");

  const selected = isMobile
    ? activeId
    : (activeId ?? conversations?.[0]?.id ?? null);

  const activeConversation = conversations?.find((c) => c.id === selected);

  useEffect(() => {
    if (!selected) return;
    const conversation = conversations?.find((c) => c.id === selected);
    if (!conversation || conversation.unread === 0) return;

    void (async () => {
      await MessagingService.markAsRead(selected);
      await mutate("/messaging/conversations");
    })();
  }, [selected, conversations, mutate]);

  function handleSelect(id: string) {
    setActiveId(id);
    if (isMobile) setMobileView("thread");
  }

  function handleBack() {
    setMobileView("list");
  }

  const showList = !isMobile || mobileView === "list";
  const showThread = !isMobile || mobileView === "thread";

  return (
    <div className="h-[calc(100vh-7rem)] md:h-[calc(100vh-6rem)]">
      <Card className="h-full grid grid-cols-1 md:grid-cols-[320px_1fr] overflow-hidden p-0">
        {showList && (
          <ConversationList
            items={conversations}
            isLoading={isLoading}
            selectedId={selected}
            onSelect={handleSelect}
          />
        )}
        {showThread && (
          <MessageThread
            conversationId={selected}
            participantName={activeConversation?.participantName}
            onBack={isMobile ? handleBack : undefined}
          />
        )}
      </Card>
    </div>
  );
}

function ConversationList({
  items,
  isLoading,
  selectedId,
  onSelect,
}: {
  items: ReturnType<typeof useConversations>["data"];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="h-full border-r border-border overflow-y-auto bg-sidebar/40 md:border-r">
      <div className="px-4 h-14 flex items-center border-b border-border">
        <h2 className="text-sm font-semibold">Messages</h2>
      </div>
      <ul role="list">
        {isLoading && Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="p-4 flex gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </li>
        ))}
        {items?.map((c) => {
          const active = c.id === selectedId;
          return (
            <li key={c.id}>
              <button
                onClick={() => onSelect(c.id)}
                className={cn(
                  "w-full text-left px-4 py-3 flex gap-3 border-b border-border transition-colors",
                  active ? "bg-accent" : "hover:bg-accent/50",
                )}
              >
                <Avatar name={c.participantName} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium truncate">{c.participantName}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {formatRelativeTime(c.lastMessageAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className="text-xs text-muted-foreground truncate">
                      {c.lastMessage}
                    </p>
                    {c.unread > 0 && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-medium h-4 min-w-4 px-1 rounded-full flex items-center justify-center">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function MessageThread({
  conversationId,
  participantName,
  onBack,
}: {
  conversationId: string | null;
  participantName?: string;
  onBack?: () => void;
}) {
  const { data: messages, isLoading } = useMessages(conversationId);
  const { mutate } = useSWRConfig();

  if (!conversationId) {
    return (
      <div className="hidden md:flex h-full items-center justify-center">
        <EmptyState
          icon={<MessageSquare className="h-5 w-5" />}
          title="Select a conversation"
          description="Pick a thread from the list to start chatting."
        />
      </div>
    );
  }

  async function send(payload: SendMessagePayload) {
    await MessagingService.send(conversationId!, payload);
    await mutate(`/messaging/conversations/${conversationId}/messages`);
    await mutate("/messaging/conversations");
  }

  return (
    <section className="flex h-full flex-col min-h-0">
      <div className="h-14 px-3 md:px-5 flex items-center gap-2 border-b border-border shrink-0">
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onBack}
            aria-label="Back to messages"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h2 className="text-sm font-semibold truncate">
          {participantName ?? "Conversation"}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-3" role="log" aria-live="polite">
        {isLoading && <Skeleton className="h-12 w-2/3" />}
        {messages?.map((m) => (
          <MessageBubble key={m.id} message={m} mine={m.senderId === "u_me"} />
        ))}
      </div>
      <MessageComposer onSend={send} />
    </section>
  );
}
