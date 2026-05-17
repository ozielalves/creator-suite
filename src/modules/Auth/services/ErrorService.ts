import { ZodError } from "zod";
import { HttpError } from "@/modules/Common/services/HttpClient";

export type AuthErrorContext = "login" | "register" | "forgot";

export const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password";
export const GENERIC_AUTH_ERROR = "Something went wrong. Please try again.";

/**
 * ErrorService — singleton for mapping API and validation failures to user-safe copy.
 */
class ErrorServiceImpl {
  /** Maps failures to user-safe copy (avoids account enumeration on login). */
  toSafeAuthMessage(err: unknown, context: AuthErrorContext = "login") {
    if (err instanceof ZodError) {
      return err.errors[0]?.message ?? "Please check your input";
    }

    if (err instanceof HttpError) {
      if (err.status === 401) {
        return context === "login" ? INVALID_CREDENTIALS_MESSAGE : GENERIC_AUTH_ERROR;
      }
      if (err.status === 429) {
        return "Too many attempts. Please try again later.";
      }
      if (err.status === 400 || err.status === 409) {
        const message = this.parseApiMessage(err.body);
        if (message) return message;
      }
      return GENERIC_AUTH_ERROR;
    }

    if (err instanceof Error && err.message && !err.message.startsWith("HTTP")) {
      return err.message;
    }

    return GENERIC_AUTH_ERROR;
  }

  private parseApiMessage(body: unknown): string | null {
    if (typeof body === "object" && body !== null && "message" in body) {
      const message = (body as { message: unknown }).message;
      return typeof message === "string" ? message : null;
    }
    return null;
  }
}

const errorService = new ErrorServiceImpl();
export { errorService as ErrorService };
