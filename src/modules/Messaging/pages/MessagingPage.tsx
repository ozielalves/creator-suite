import { useState } from "react";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import { useSWRConfig } from "swr";
import { Avatar, Button, Card, EmptyState, Skeleton } from "@/modules/UI";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatRelativeTime } from "@/modules/Common/utils/format";
import { useConversations, useMessages } from "../hooks/useMessaging";
import { MessagingService } from "../services/MessagingService";

export function MessagingPage() {
  const isMobile = useIsMobile();
  const { data: conversations, isLoading } = useConversations();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");

  const selected = isMobile
    ? activeId
    : (activeId ?? conversations?.[0]?.id ?? null);

  const activeConversation = conversations?.find((c) => c.id === selected);

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
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

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

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setSending(true);
    try {
      await MessagingService.send(conversationId!, value);
      setText("");
      await mutate(`/messaging/conversations/${conversationId}/messages`);
      await mutate("/messaging/conversations");
    } finally {
      setSending(false);
    }
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
      {/* Virtualization note: for production we'd swap this for react-window;
          the list contract is simple enough that the swap is local. */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3" role="log" aria-live="polite">
        {isLoading && <Skeleton className="h-12 w-2/3" />}
        {messages?.map((m) => {
          const mine = m.senderId === "u_me";
          return (
            <div
              key={m.id}
              className={cn("flex", mine ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                  mine
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md",
                )}
              >
                {m.text}
                <div
                  className={cn(
                    "text-[10px] mt-1 opacity-70",
                    mine ? "text-primary-foreground" : "text-muted-foreground",
                  )}
                >
                  {formatRelativeTime(m.sentAt)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={send}
        className="border-t border-border p-3 flex items-center gap-2"
      >
        <label htmlFor="msg-input" className="sr-only">
          Message
        </label>
        <input
          id="msg-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 h-10 rounded-lg border border-input bg-surface px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" size="icon" isLoading={sending} aria-label="Send message">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </section>
  );
}
