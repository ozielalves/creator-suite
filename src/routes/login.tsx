import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/modules/Auth";

export const Route = createFileRoute("/login")({ component: LoginPage });
