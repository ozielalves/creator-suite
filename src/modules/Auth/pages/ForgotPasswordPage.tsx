import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button, Input } from "@/modules/UI";
import { AuthService } from "../services/AuthService";
import { LOGIN_ROUTE } from "../constants";
import { AuthShell } from "./LoginPage";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../validation";
import { ErrorService } from "../services/ErrorService";

export function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  async function onSubmit(data: ForgotPasswordFormValues) {
    try {
      await AuthService.forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setSent(true);
    } catch (err) {
      setError("root", { message: ErrorService.toSafeAuthMessage(err, "forgot") });
    }
  }

  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a reset link">
      {sent ? (
        <div className="flex flex-col items-center text-center py-4">
          <CheckCircle2 className="h-10 w-10 text-success mb-3" />
          <p className="text-sm text-foreground">Check your inbox</p>
          <p className="text-xs text-muted-foreground mt-1">
            If an account exists for {submittedEmail}, a reset link is on its way.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          {errors.root?.message ? (
            <p className="text-xs text-destructive" role="alert">
              {errors.root.message}
            </p>
          ) : null}
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
          <Button type="submit" isLoading={isSubmitting} fullWidth size="lg">
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
