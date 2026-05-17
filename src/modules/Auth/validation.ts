import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .email("Enter a valid email address")
  .transform((value) => value.toLowerCase());

const passwordField = z.string().min(1, "Password is required").max(128, "Password is too long");

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: emailField,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[0-9]/, "Password must include a number"),
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function parseLoginCredentials(input: unknown) {
  return loginSchema.safeParse(input);
}

export function parseRegisterCredentials(input: unknown) {
  return registerSchema.safeParse(input);
}

export function parseForgotPasswordEmail(input: unknown) {
  return forgotPasswordSchema.safeParse({ email: input });
}
