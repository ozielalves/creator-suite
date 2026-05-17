import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button, Input } from "@/modules/UI";
import { AuthService } from "../services/AuthService";
import { LOGIN_ROUTE } from "../constants";
import { AuthShell } from "./LoginPage";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthService.forgotPassword(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a reset link">
      {sent ? (
        <div className="flex flex-col items-center text-center py-4">
          <CheckCircle2 className="h-10 w-10 text-success mb-3" />
          <p className="text-sm text-foreground">Check your inbox</p>
          <p className="text-xs text-muted-foreground mt-1">
            If an account exists for {email}, a reset link is on its way.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <Input label="Email" type="email" leftIcon={<Mail className="h-4 w-4" />} value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" isLoading={loading} fullWidth size="lg">
            Send reset link
          </Button>
        </form>
      )}
      <p className="text-xs text-center text-muted-foreground mt-6">
        <Link to={LOGIN_ROUTE} className="text-primary hover:underline font-medium">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
