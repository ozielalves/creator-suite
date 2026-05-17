import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, User } from "lucide-react";
import { Button, Input } from "@/modules/UI";
import { AuthService } from "../services/AuthService";
import { useAuthStore } from "../hooks/useAuthStore";
import { LOGIN_ROUTE } from "../constants";
import { AuthShell } from "./LoginPage";

export function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await AuthService.register({ name, email, password });
      setUser(user);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError((err as Error).message ?? "Unable to register");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Start building your audience today">
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Input label="Full name" leftIcon={<User className="h-4 w-4" />} value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Email" type="email" autoComplete="email" leftIcon={<Mail className="h-4 w-4" />} value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" autoComplete="new-password" leftIcon={<Lock className="h-4 w-4" />} value={password} onChange={(e) => setPassword(e.target.value)} required error={error ?? undefined} />
        <Button type="submit" isLoading={loading} fullWidth size="lg">
          Create account
        </Button>
      </form>
      <p className="text-xs text-center text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link to={LOGIN_ROUTE} className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
