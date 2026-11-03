"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";

interface GoogleAuthButtonProps {
  mode?: "signin" | "signup";
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (err: string) => void;
}

export default function GoogleAuthButton({
  mode = "signin",
  redirectTo = "/",
  onSuccess,
  onError,
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const [setupNotice, setSetupNotice] = useState<string | null>(null);

  const handleGoogleClick = async () => {
    setLoading(true);
    setSetupNotice(null);

    try {
      // Real Official Google OAuth Flow:
      // Redirects user directly to accounts.google.com where Google displays
      // whichever real Gmail accounts the visitor is currently logged into on their browser.
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo || "/",
      });

      if (res && "error" in res && res.error) {
        const errorMsg =
          res.error.message ||
          "Google Sign-In requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local";
        setSetupNotice(errorMsg);
        if (onError) onError(errorMsg);
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Google Sign-In is not configured yet. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local";
      setSetupNotice(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const buttonText = mode === "signup" ? "Sign up with Google" : "Sign in with Google";

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[var(--card)] hover:bg-[var(--accent)] text-[var(--foreground)] font-semibold text-xs sm:text-sm border border-[var(--border)] shadow-xs hover:border-[var(--primary)]/50 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-[var(--foreground)] border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{buttonText}</span>
      </button>

      {setupNotice && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] leading-relaxed flex items-start gap-2 animate-in fade-in duration-150">
          <span className="text-sm shrink-0">ℹ️</span>
          <div>
            <p className="font-bold">Google Sign-In Notice</p>
            <p className="text-[10px] opacity-90 mt-0.5">{setupNotice}</p>
          </div>
        </div>
      )}
    </div>
  );
}
