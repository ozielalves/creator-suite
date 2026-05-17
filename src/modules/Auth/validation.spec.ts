import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema, forgotPasswordSchema } from "./validation";

describe("auth validation", () => {
  it("normalizes login email", () => {
    const result = loginSchema.safeParse({
      email: "  Alex@Creator.Studio ",
      password: "secret",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("alex@creator.studio");
    }
  });

  it("rejects invalid login email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "x" });
    expect(result.success).toBe(false);
  });

  it("requires register password complexity", () => {
    const weak = registerSchema.safeParse({
      name: "Alex",
      email: "alex@creator.studio",
      password: "short",
    });
    expect(weak.success).toBe(false);

    const strong = registerSchema.safeParse({
      name: "Alex",
      email: "alex@creator.studio",
      password: "CreatorStudio1",
    });
    expect(strong.success).toBe(true);
  });

  it("validates forgot-password email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "" }).success).toBe(false);
    expect(forgotPasswordSchema.safeParse({ email: "a@b.co" }).success).toBe(true);
  });
});
