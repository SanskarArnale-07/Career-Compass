"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Compass,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  Info,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await login(email.trim(), password, rememberMe);
    setIsSubmitting(false);

    if (result.success) {
      router.push(redirectUrl);
    } else {
      setError(result.error || "Invalid email or password.");
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Branding & Header */}
      <div className="text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-6 group transition-opacity hover:opacity-90"
        >
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <Compass className="h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            Career<span className="text-primary/90">Compass</span>
          </span>
        </Link>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to access your saved career path, roadmaps, and progress.
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl backdrop-blur-sm">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3.5 text-xs sm:text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-foreground mb-1.5"
            >
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                placeholder="name@example.com"
                disabled={isSubmitting}
                className={`w-full rounded-lg border bg-background/50 pl-10 pr-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:outline-none focus:ring-1 ${
                  fieldErrors.email
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30"
                    : "border-border/80 focus:border-primary focus:ring-primary/40"
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-foreground"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-primary/90 hover:text-primary hover:underline transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                  }
                }}
                placeholder="••••••••"
                disabled={isSubmitting}
                className={`w-full rounded-lg border bg-background/50 pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:outline-none focus:ring-1 ${
                  fieldErrors.password
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30"
                    : "border-border/80 focus:border-primary focus:ring-primary/40"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-400">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center gap-2">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-border/80 bg-background/50 text-primary accent-primary focus:ring-primary/30 cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="text-xs text-muted-foreground select-none cursor-pointer"
            >
              Remember me on this device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition-all hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer sign up link */}
        <div className="mt-6 pt-6 border-t border-border/60 text-center">
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href={`/signup${
                redirectUrl !== "/dashboard"
                  ? `?redirect=${encodeURIComponent(redirectUrl)}`
                  : ""
              }`}
              className="font-medium text-primary hover:underline transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal Helper */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-w-sm w-full rounded-xl border border-border/80 bg-card p-6 shadow-2xl text-left">
            <div className="flex items-center gap-2.5 text-primary mb-3">
              <Info className="h-5 w-5 shrink-0" />
              <h3 className="font-heading font-semibold text-foreground text-sm">
                Resetting Password
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-5">
              Automated password reset via email is currently in demo mode. If
              you have forgotten your password, you can register a new account
              with another email address or contact your instructor.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full rounded-lg bg-secondary py-2 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span>Loading...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
