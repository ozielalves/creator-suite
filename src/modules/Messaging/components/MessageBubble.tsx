import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/modules/Common/utils/format";
import type { Message } from "../types";

type MessageBubbleProps = {
  message: Message;
  mine: boolean;
};

export function MessageBubble({ message, mine }: MessageBubbleProps) {
  const hasText = Boolean(message.text.trim());
  const hasMedia = Boolean(message.attachments?.length);

  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex max-w-[85%] flex-col gap-1.5",
          mine ? "items-end" : "items-start",
        )}
      >
        {hasText && (
          <div
            className={cn(
              "rounded-2xl px-3.5 py-2 text-sm",
              mine
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-muted text-foreground rounded-bl-md",
            )}
          >
            {message.text}
          </div>
        )}
        {message.attachments?.map((attachment) => (
          <div
            key={attachment.id}
            className={cn(
              "overflow-hidden rounded-2xl border border-border/60 bg-surface",
              mine ? "rounded-br-md" : "rounded-bl-md",
            )}
          >
            {attachment.type === "video" ? (
              <video
                src={attachment.url}
                controls
                playsInline
                preload="metadata"
                className="max-h-64 w-full max-w-[280px] bg-black object-contain"
                aria-label={attachment.name}
              />
            ) : (
              <img
                src={attachment.url}
                alt={attachment.name}
                className="max-h-64 w-full max-w-[280px] object-cover"
                loading="lazy"
              />
            )}
          </div>
        ))}
        <span className="px-1 text-[10px] text-muted-foreground opacity-70">
          {formatRelativeTime(message.sentAt)}
        </span>
      </div>
    </div>
  );
}
