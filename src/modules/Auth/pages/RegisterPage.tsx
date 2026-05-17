import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, User } from "lucide-react";
import { Button, Input } from "@/modules/UI";
import { AuthService } from "../services/AuthService";
import { useAuthStore } from "../hooks/useAuthStore";
import { LOGIN_ROUTE } from "../constants";
import { AuthShell } from "./LoginPage";
import { registerSchema, type RegisterFormValues } from "../validation";
import { ErrorService } from "../services/ErrorService";

export function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(data: RegisterFormValues) {
    try {
      const user = await AuthService.register(data);
      setUser(user);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError("root", { message: ErrorService.toSafeAuthMessage(err, "register") });
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Start building your audience today">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {errors.root?.message ? (
          <p className="text-xs text-destructive" role="alert">
            {errors.root.message}
          </p>
        ) : null}
        <Input
          label="Full name"
          placeholder="Alex Morgan"
          autoComplete="name"
          maxLength={100}
          leftIcon={<User className="h-4 w-4" />}
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          maxLength={254}
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          maxLength={128}
          hint="At least 8 characters with upper, lower, and a number"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" isLoading={isSubmitting} fullWidth size="lg">
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
