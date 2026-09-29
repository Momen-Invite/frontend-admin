"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Eye, EyeOff } from "lucide-react";

// ── Turnstile Types ─────────────────────────────────────────────────────────
declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        "error-callback"?: () => void;
        "expired-callback"?: () => void;
        theme?: "light" | "dark" | "auto";
        size?: "normal" | "compact";
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

// ── Google Icon ─────────────────────────────────────────────────────────────
const IconGoogle = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// ── Schema ─────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

// ── Inner Component ────────────────────────────────────────────────────────
function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lockoutMsg, setLockoutMsg] = useState<string | null>(null);

  // ── Turnstile State ─────────────────────────────────────────────────────
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

  const renderTurnstile = useCallback(() => {
    if (!turnstileRef.current || !window.turnstile || !TURNSTILE_SITE_KEY) return;
    // Cleanup previous widget if any
    if (widgetIdRef.current) {
      try { window.turnstile!.remove(widgetIdRef.current); } catch {}
      widgetIdRef.current = null;
    }
    turnstileRef.current.innerHTML = "";
    widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (token: string) => {
        setTurnstileToken(token);
        setTurnstileError(false);
      },
      "error-callback": () => setTurnstileError(true),
      "expired-callback": () => setTurnstileToken(null),
      theme: "light",
      size: "normal",
    });
  }, [TURNSTILE_SITE_KEY]);

  // Load Turnstile script
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    const existing = document.querySelector('script[src*="turnstile"]');
    if (existing) {
      // Script already loaded, just render
      if (window.turnstile) renderTurnstile();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => renderTurnstile();
    document.head.appendChild(script);
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch {}
      }
    };
  }, [TURNSTILE_SITE_KEY, renderTurnstile]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(searchParams.get("from") || "/");
    }
  }, [isAuthenticated, authLoading, router, searchParams]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setLockoutMsg("Harap selesaikan verifikasi anti-bot terlebih dahulu.");
      return;
    }
    setIsLoading(true);
    setLockoutMsg(null);
    try {
      await login({
        ...data,
        turnstileToken: turnstileToken || undefined,
      });
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string };
      if (e?.status === 423) {
        setLockoutMsg("Akun terkunci 15 menit karena terlalu banyak percobaan gagal.");
      } else if (e?.message) {
        setLockoutMsg(e.message);
      }
      // Reset Turnstile on login failure so user can retry
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.reset(widgetIdRef.current); } catch {}
        setTurnstileToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f7f7f8]">
        <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] flex items-center justify-center p-4">
      {/* Subtle background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-green-100/60 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-purple-100/40 blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.08)] p-8 sm:p-10 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-500">

        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-base">
                celebration
              </span>
            </div>
            <span className="font-bold text-gray-900 text-base tracking-tight">
              Momen Invite
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-snug">
            Masuk ke Admin Panel
          </h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Kelola undangan, pengguna, dan konten platform
          </p>
        </div>

        {/* Lockout alert */}
        {lockoutMsg && (
          <div className="mb-5 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-xs text-red-600">
            {lockoutMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@momeninvite.com"
              disabled={isLoading}
              autoComplete="email"
              className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50/80 px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-gray-400 focus:bg-white focus:ring-3 focus:ring-gray-200 disabled:opacity-50"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-[11px] text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                disabled={isLoading}
                autoComplete="current-password"
                className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50/80 px-4 pr-11 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-gray-400 focus:bg-white focus:ring-3 focus:ring-gray-200 disabled:opacity-50"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Turnstile Anti-Bot */}
          {TURNSTILE_SITE_KEY && (
            <div className="flex flex-col items-center">
              <div ref={turnstileRef} />
              {turnstileError && (
                <p className="mt-1 text-[11px] text-red-500">
                  Verifikasi gagal. Silakan coba lagi.
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-full bg-gray-900 hover:bg-gray-700 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                "Masuk ke Dasbor"
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-100" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-gray-400">atau</span>
          </div>
        </div>

        {/* Google */}
        <button
          type="button"
          className="w-full h-11 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          onClick={() => {
            // Google OAuth — configure when ready
          }}
        >
          <IconGoogle />
          Lanjutkan dengan Google
        </button>

        {/* Brute force notice */}
        <p className="mt-5 text-center text-[11px] text-gray-400 leading-relaxed">
          Sistem menerapkan perlindungan brute-force.{" "}
          <span className="text-gray-500">5× gagal = kunci 15 menit.</span>
        </p>

        {/* Demo shortcut */}
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => {
              setValue("email", "superadmin@momeninvite.com");
              setValue("password", "Superadmin123#");
            }}
            className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
          >
            Isi akun demo superadmin
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Export ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#f7f7f8]">
          <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}
