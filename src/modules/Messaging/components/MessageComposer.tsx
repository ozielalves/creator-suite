import { useRef, useState } from "react";
import { FileText, ImagePlus, Send, X } from "lucide-react";
import { Button } from "@/modules/UI";
import { cn } from "@/lib/utils";
import { ACCEPTED_MEDIA_ACCEPT, MAX_ATTACHMENTS_PER_MESSAGE } from "../constants";
import { MediaService, MediaValidationError } from "../services/MediaService";
import type { MessageMediaType, SendMessagePayload } from "../types";

type PendingFile = {
  file: File;
  previewUrl: string;
  type: MessageMediaType;
};

type MessageComposerProps = {
  onSend: (payload: SendMessagePayload) => Promise<void>;
  disabled?: boolean;
};

export function MessageComposer({ onSend, disabled }: MessageComposerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend = !disabled && !sending && (text.trim().length > 0 || pending.length > 0);

  function addFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0) return;

    setError(null);
    const remaining = MAX_ATTACHMENTS_PER_MESSAGE - pending.length;
    if (remaining <= 0) {
      setError(`You can attach up to ${MAX_ATTACHMENTS_PER_MESSAGE} files per message.`);
      return;
    }

    const toAdd = list.slice(0, remaining);
    const skipped = list.length - toAdd.length;

    try {
      const next = toAdd.map((file) => {
        const type = MediaService.getMediaType(file);
        return {
          file,
          previewUrl: type === "document" ? "" : URL.createObjectURL(file),
          type,
        };
      });
      setPending((prev) => [...prev, ...next]);
      if (skipped > 0) {
        setError(`Only ${MAX_ATTACHMENTS_PER_MESSAGE} attachments are allowed per message.`);
      }
    } catch (err) {
      setError(err instanceof MediaValidationError ? err.message : "Could not add file.");
    }
  }

  function removePending(index: number) {
    setPending((prev) => {
      const item = prev[index];
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;

    setSending(true);
    setError(null);
    try {
      const attachments =
        pending.length > 0
          ? await MediaService.filesToAttachments(pending.map((p) => p.file))
          : undefined;
      await onSend({
        text: text.trim() || undefined,
        attachments,
      });
      pending.forEach((p) => {
        if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
      });
      setText("");
      setPending([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof MediaValidationError ? err.message : "Failed to send message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border">
      {pending.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-3 pt-3">
          {pending.map((item, index) => (
            <div key={`${item.file.name}-${index}`} className="relative shrink-0">
              {item.type === "video" ? (
                <video
                  src={item.previewUrl}
                  className="h-16 w-16 rounded-lg border border-border object-cover bg-black"
                  muted
                />
              ) : item.type === "document" ? (
                <div className="flex h-16 w-28 items-center gap-2 rounded-lg border border-border bg-muted/50 px-2">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="truncate text-[10px] font-medium">{item.file.name}</span>
                </div>
              ) : (
                <img
                  src={item.previewUrl}
                  alt=""
                  className="h-16 w-16 rounded-lg border border-border object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => removePending(index)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background shadow"
                aria-label={`Remove ${item.file.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      {error && (
        <p className="px-3 pt-2 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="flex items-center gap-2 p-3">
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_MEDIA_ACCEPT}
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled || sending || pending.length >= MAX_ATTACHMENTS_PER_MESSAGE}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach image, GIF, video, or document"
        >
          <ImagePlus className="h-4 w-4" />
        </Button>
        <label htmlFor="msg-input" className="sr-only">
          Message
        </label>
        <input
          ref={inputRef}
          id="msg-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          disabled={disabled || sending}
          className={cn(
            "flex-1 h-10 rounded-lg border border-input bg-surface px-3 text-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
        <Button
          type="submit"
          size="icon"
          isLoading={sending}
          disabled={!canSend}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
