import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock } from "lucide-react";
import { Button, Card, Input } from "@/modules/UI";
import { AuthService } from "../services/AuthService";
import { useAuthStore } from "../hooks/useAuthStore";
import { REGISTER_ROUTE, FORGOT_PASSWORD_ROUTE } from "../constants";

export function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await AuthService.login({ email, password });
      setUser(user);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError((err as Error).message ?? "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your Creator Studio account">
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          leftIcon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          leftIcon={<Lock className="h-4 w-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error ?? undefined}
        />
        <div className="flex items-center justify-end -mt-2">
          <Link to={FORGOT_PASSWORD_ROUTE} className="text-xs text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" isLoading={loading} fullWidth size="lg">
          Sign in
        </Button>
      </form>
      <p className="text-xs text-center text-muted-foreground mt-6">
        Don't have an account?{" "}
        <Link to={REGISTER_ROUTE} className="text-primary hover:underline font-medium">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold mb-4">
            C
          </div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <Card className="p-6">{children}</Card>
      </div>
    </main>
  );
}
