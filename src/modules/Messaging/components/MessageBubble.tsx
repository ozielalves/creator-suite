import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/modules/Common/utils/format";
import type { Message, MessageAttachment } from "../types";

type MessageBubbleProps = {
  message: Message;
  mine: boolean;
};

function AttachmentContent({ attachment }: { attachment: MessageAttachment }) {
  if (attachment.type === "video") {
    return (
      <video
        src={attachment.url}
        controls
        playsInline
        preload="metadata"
        className="max-h-64 w-full max-w-[280px] bg-black object-contain"
        aria-label={attachment.name}
      />
    );
  }

  if (attachment.type === "document") {
    return (
      <a
        href={attachment.url}
        download={attachment.name}
        className="flex max-w-[280px] items-center gap-3 px-3.5 py-3 text-sm hover:bg-accent/40 transition-colors"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <FileText className="h-4 w-4 text-muted-foreground" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{attachment.name}</span>
          <span className="text-xs text-muted-foreground">Tap to download</span>
        </span>
      </a>
    );
  }

  return (
    <img
      src={attachment.url}
      alt={attachment.name}
      className="max-h-64 w-full max-w-[280px] object-cover"
      loading="lazy"
    />
  );
}

export function MessageBubble({ message, mine }: MessageBubbleProps) {
  const hasText = Boolean(message.text.trim());

  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[85%] flex-col gap-1.5", mine ? "items-end" : "items-start")}>
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
            <AttachmentContent attachment={attachment} />
          </div>
        ))}
        <span className="px-1 text-[10px] text-muted-foreground opacity-70">
          {formatRelativeTime(message.sentAt)}
        </span>
      </div>
    </div>
  );
}
