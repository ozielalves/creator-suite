import {
  ACCEPTED_MEDIA_ACCEPT,
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

class MediaService {
  getMediaType(file: File): MessageMediaType {
    if (file.type === "image/gif") return "gif";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("image/")) return "image";
    throw new MediaValidationError(
      `Unsupported file type: ${file.type || file.name}`,
    );
  }

  validateMediaFile(file: File): void {
    const type = this.getMediaType(file);
    const maxBytes = type === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      const limitMb = Math.round(maxBytes / (1024 * 1024));
      throw new MediaValidationError(
        `${file.name} exceeds the ${limitMb}MB limit for ${type === "video" ? "videos" : "images"}.`,
      );
    }
  }

  async fileToAttachment(
    file: File,
  ): Promise<Omit<MessageAttachment, "id">> {
    this.validateMediaFile(file);
    const type = this.getMediaType(file);
    const url = await this.readAsDataUrl(file);
    return { type, url, name: file.name, mimeType: file.type };
  }

  async filesToAttachments(
    files: File[],
  ): Promise<Omit<MessageAttachment, "id">[]> {
    return Promise.all(files.map((file) => this.fileToAttachment(file)));
  }

  formatAttachmentPreview(
    attachments: Pick<MessageAttachment, "type">[],
  ): string {
    if (attachments.length === 0) return "";
    const types = new Set(attachments.map((a) => a.type));
    if (types.size === 1) {
      const only = attachments[0]!.type;
      if (only === "video") return "Video";
      if (only === "gif") return "GIF";
      return attachments.length > 1 ? `${attachments.length} photos` : "Photo";
    }
    return `${attachments.length} attachments`;
  }

  formatLastMessage(
    text: string,
    attachments?: MessageAttachment[],
  ): string {
    const trimmed = text.trim();
    if (trimmed && attachments?.length) {
      return `${trimmed} · ${this.formatAttachmentPreview(attachments)}`;
    }
    if (trimmed) return trimmed;
    return this.formatAttachmentPreview(attachments ?? []);
  }

  private readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () =>
        reject(new MediaValidationError(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });
  }
}

const mediaService = new MediaService();
export { mediaService as MediaService };
