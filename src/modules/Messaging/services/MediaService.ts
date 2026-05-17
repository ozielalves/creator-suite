import {
  ACCEPTED_MEDIA_ACCEPT,
  MAX_DOCUMENT_BYTES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from "../constants";
import type { MessageAttachment, MessageMediaType } from "../types";

export class MediaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MediaValidationError";
  }
}

const DOCUMENT_EXTENSIONS = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".txt",
  ".csv",
]);

const DOCUMENT_MIME_PREFIXES = [
  "application/pdf",
  "application/msword",
  "application/vnd.ms-",
  "application/vnd.openxmlformats-officedocument",
  "text/plain",
  "text/csv",
];

class MediaService {
  readonly acceptedAccept = ACCEPTED_MEDIA_ACCEPT;

  getMediaType(file: File): MessageMediaType {
    if (file.type === "image/gif") return "gif";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("image/")) return "image";
    if (this.isDocument(file)) return "document";
    throw new MediaValidationError(`Unsupported file type: ${file.type || file.name}`);
  }

  validateMediaFile(file: File): void {
    const type = this.getMediaType(file);
    const maxBytes =
      type === "video"
        ? MAX_VIDEO_BYTES
        : type === "document"
          ? MAX_DOCUMENT_BYTES
          : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      const limitMb = Math.round(maxBytes / (1024 * 1024));
      const label = type === "video" ? "videos" : type === "document" ? "documents" : "images";
      throw new MediaValidationError(`${file.name} exceeds the ${limitMb}MB limit for ${label}.`);
    }
  }

  async fileToAttachment(file: File): Promise<Omit<MessageAttachment, "id">> {
    this.validateMediaFile(file);
    const type = this.getMediaType(file);
    const url = await this.readAsDataUrl(file);
    return { type, url, name: file.name, mimeType: file.type };
  }

  async filesToAttachments(files: File[]): Promise<Omit<MessageAttachment, "id">[]> {
    return Promise.all(files.map((file) => this.fileToAttachment(file)));
  }

  formatAttachmentPreview(attachments: Pick<MessageAttachment, "type">[]): string {
    if (attachments.length === 0) return "";
    const types = new Set(attachments.map((a) => a.type));
    if (types.size === 1) {
      const only = attachments[0]!.type;
      if (only === "video") return "Video";
      if (only === "gif") return "GIF";
      if (only === "document") {
        return attachments.length > 1 ? `${attachments.length} documents` : "Document";
      }
      return attachments.length > 1 ? `${attachments.length} photos` : "Photo";
    }
    return `${attachments.length} attachments`;
  }

  formatLastMessage(text: string, attachments?: MessageAttachment[]): string {
    const trimmed = text.trim();
    if (trimmed && attachments?.length) {
      return `${trimmed} · ${this.formatAttachmentPreview(attachments)}`;
    }
    if (trimmed) return trimmed;
    return this.formatAttachmentPreview(attachments ?? []);
  }

  private isDocument(file: File): boolean {
    if (
      DOCUMENT_MIME_PREFIXES.some((prefix) => file.type === prefix || file.type.startsWith(prefix))
    ) {
      return true;
    }
    const dot = file.name.lastIndexOf(".");
    if (dot === -1) return false;
    return DOCUMENT_EXTENSIONS.has(file.name.slice(dot).toLowerCase());
  }

  private readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new MediaValidationError(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });
  }
}

const mediaService = new MediaService();
export { mediaService as MediaService };
