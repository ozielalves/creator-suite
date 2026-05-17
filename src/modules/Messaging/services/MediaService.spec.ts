import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MAX_IMAGE_BYTES, MAX_VIDEO_BYTES } from "../constants";
import { MediaService, MediaValidationError } from "./MediaService";

function makeFile(name: string, type: string, size = 1024): File {
  return new File([new Uint8Array(size)], name, { type });
}

describe("MediaService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("getMediaType", () => {
    it("detects image, gif, and video types", () => {
      expect(MediaService.getMediaType(makeFile("a.jpg", "image/jpeg"))).toBe(
        "image",
      );
      expect(MediaService.getMediaType(makeFile("b.gif", "image/gif"))).toBe("gif");
      expect(MediaService.getMediaType(makeFile("c.mp4", "video/mp4"))).toBe(
        "video",
      );
    });

    it("rejects unsupported types", () => {
      expect(() =>
        MediaService.getMediaType(makeFile("doc.pdf", "application/pdf")),
      ).toThrow(MediaValidationError);
    });
  });

  describe("validateMediaFile", () => {
    it("rejects images over the image size limit", () => {
      expect(() =>
        MediaService.validateMediaFile(
          makeFile("big.jpg", "image/jpeg", MAX_IMAGE_BYTES + 1),
        ),
      ).toThrow(/exceeds the 10MB limit for images/);
    });

    it("rejects videos over the video size limit", () => {
      expect(() =>
        MediaService.validateMediaFile(
          makeFile("big.mp4", "video/mp4", MAX_VIDEO_BYTES + 1),
        ),
      ).toThrow(/exceeds the 25MB limit for videos/);
    });

    it("allows files within size limits", () => {
      expect(() =>
        MediaService.validateMediaFile(makeFile("ok.jpg", "image/jpeg")),
      ).not.toThrow();
    });
  });

  describe("fileToAttachment", () => {
    it("returns attachment metadata with a data URL", async () => {
      const file = makeFile("shot.png", "image/png");
      const attachment = await MediaService.fileToAttachment(file);

      expect(attachment).toEqual({
        type: "image",
        url: expect.stringMatching(/^data:image\/png;base64,/),
        name: "shot.png",
        mimeType: "image/png",
      });
    });

    it("propagates read errors as MediaValidationError", async () => {
      const file = makeFile("broken.jpg", "image/jpeg");
      class FailingFileReader {
        result: string | ArrayBuffer | null = null;
        onload: ((ev: ProgressEvent<FileReader>) => void) | null = null;
        onerror: ((ev: ProgressEvent<FileReader>) => void) | null = null;
        readAsDataURL() {
          this.onerror?.({} as ProgressEvent<FileReader>);
        }
        abort() {}
        readAsArrayBuffer() {}
        readAsBinaryString() {}
        readAsText() {}
        addEventListener() {}
        removeEventListener() {}
        dispatchEvent() {
          return true;
        }
        DONE = 2;
        EMPTY = 0;
        LOADING = 1;
        error: DOMException | null = null;
        onabort: ((ev: ProgressEvent<FileReader>) => void) | null = null;
        onloadend: ((ev: ProgressEvent<FileReader>) => void) | null = null;
        onloadstart: ((ev: ProgressEvent<FileReader>) => void) | null = null;
        onprogress: ((ev: ProgressEvent<FileReader>) => void) | null = null;
        readyState = 0;
      }
      vi.stubGlobal("FileReader", FailingFileReader);

      await expect(MediaService.fileToAttachment(file)).rejects.toThrow(
        /Failed to read broken.jpg/,
      );
      await expect(MediaService.fileToAttachment(file)).rejects.toBeInstanceOf(
        MediaValidationError,
      );
    });
  });

  describe("filesToAttachments", () => {
    it("converts multiple files in parallel", async () => {
      const files = [
        makeFile("a.jpg", "image/jpeg"),
        makeFile("b.gif", "image/gif"),
      ];
      const attachments = await MediaService.filesToAttachments(files);

      expect(attachments).toHaveLength(2);
      expect(attachments[0]?.type).toBe("image");
      expect(attachments[1]?.type).toBe("gif");
    });
  });

  describe("formatAttachmentPreview", () => {
    it("formats single and multiple attachment labels", () => {
      expect(MediaService.formatAttachmentPreview([{ type: "image" }])).toBe(
        "Photo",
      );
      expect(MediaService.formatAttachmentPreview([{ type: "gif" }])).toBe("GIF");
      expect(MediaService.formatAttachmentPreview([{ type: "video" }])).toBe(
        "Video",
      );
      expect(
        MediaService.formatAttachmentPreview([
          { type: "image" },
          { type: "image" },
        ]),
      ).toBe("2 photos");
      expect(
        MediaService.formatAttachmentPreview([
          { type: "image" },
          { type: "video" },
        ]),
      ).toBe("2 attachments");
    });

    it("returns empty string when there are no attachments", () => {
      expect(MediaService.formatAttachmentPreview([])).toBe("");
    });
  });

  describe("formatLastMessage", () => {
    it("combines text and attachment previews", () => {
      expect(
        MediaService.formatLastMessage("Hello", [
          {
            id: "a_1",
            type: "image",
            url: "x",
            name: "x.jpg",
            mimeType: "image/jpeg",
          },
        ]),
      ).toBe("Hello · Photo");
    });

    it("returns text-only or attachment-only previews", () => {
      expect(MediaService.formatLastMessage("Hello")).toBe("Hello");
      expect(
        MediaService.formatLastMessage("", [
          {
            id: "a_1",
            type: "video",
            url: "x",
            name: "clip.mp4",
            mimeType: "video/mp4",
          },
        ]),
      ).toBe("Video");
    });
  });
});
