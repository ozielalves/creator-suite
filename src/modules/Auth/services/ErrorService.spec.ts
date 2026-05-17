import { describe, it, expect } from "vitest";
import { HttpError } from "@/modules/Common/services/HttpClient";
import { ErrorService, INVALID_CREDENTIALS_MESSAGE } from "./ErrorService";

describe("ErrorService", () => {
  it("returns a generic message for failed login", () => {
    expect(ErrorService.toSafeAuthMessage(new HttpError(401, "Unauthorized", {}), "login")).toBe(
      INVALID_CREDENTIALS_MESSAGE,
    );
  });

  it("surfaces validation errors from the API", () => {
    expect(
      ErrorService.toSafeAuthMessage(
        new HttpError(400, "Bad Request", { message: "Email is required" }),
        "login",
      ),
    ).toBe("Email is required");
  });
});
