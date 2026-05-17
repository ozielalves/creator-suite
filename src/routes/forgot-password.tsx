import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/modules/Auth";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPasswordPage });
