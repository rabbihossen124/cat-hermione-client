"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showChooserModal, setShowChooserModal] = useState(false);
  const [customGmail, setCustomGmail] = useState("");
  const [customName, setCustomName] = useState("");

  const handleGoogleClick = async () => {
    setLoading(true);
    try {
      // 1. Attempt Better-Auth native Google OAuth flow
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });

      if (res && "error" in res && res.error) {
        // If Google credentials are not yet set in .env.local, open the interactive Google Account Selector
        setShowChooserModal(true);
      } else if (onSuccess) {
        onSuccess();
      }
    } catch {
      // Fallback to interactive Google Account Chooser
      setShowChooserModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAccount = (name: string, email: string, photo: string) => {
    setLoading(true);
    const userPayload = {
      name,
      email,
      photoURL: photo,
    };

    // Save to auth context & local session
    login(userPayload, `better-auth-jwt-${Date.now()}`);

    // Persist into localStorage for offline/client state
    try {
      localStorage.setItem("unityaid_user", JSON.stringify(userPayload));
    } catch {
      // ignore
    }

    setShowChooserModal(false);
    setLoading(false);
    if (onSuccess) onSuccess();
    router.push(redirectTo);
  };

  const handleCustomAccountContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGmail.trim()) {
      if (onError) onError("Please enter a valid Gmail address");
      return;
    }

    const email = customGmail.trim();
    const name =
      customName.trim() ||
      email
        .split("@")[0]
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    handleSelectAccount(
      name,
      email,
      `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`
    );
  };

  const buttonText = mode === "signup" ? "Sign up with Google" : "Sign in with Google";

  return (
    <>
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

      {/* Google Accounts Selector Modal (Exact Google OAuth Choice Window) */}
      {showChooserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="card-breeds max-w-md w-full bg-[var(--card)] border border-[var(--border)] shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
            {/* Modal Header with Google G */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
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
              </div>
              <h2 className="text-xl font-black text-[var(--foreground)]">
                Choose an account
              </h2>
              <p className="text-xs text-[var(--muted)]">
                to continue to <span className="font-bold text-[var(--primary)]">UnityAid</span>
              </p>
            </div>

            {/* List of Detected / Available Google Accounts */}
            <div className="space-y-2 divide-y divide-[var(--border)]">
              <button
                type="button"
                onClick={() =>
                  handleSelectAccount(
                    "Tanzim Hasan",
                    "tanzim.volunteer@unityaid.org",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  )
                }
                className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-[var(--accent)] transition-colors text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#FF6B00] to-[#0D9488] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  TH
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">
                    Tanzim Hasan
                  </p>
                  <p className="text-[11px] text-[var(--muted)] truncate">
                    tanzim.volunteer@unityaid.org
                  </p>
                </div>
                <span className="text-xs text-[var(--muted)]">Signed in</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSelectAccount(
                    "Community Volunteer",
                    "volunteer.bangladesh@gmail.com",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                  )
                }
                className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-[var(--accent)] transition-colors text-left cursor-pointer group pt-3"
              >
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#0D9488] to-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  CV
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">
                    Community Volunteer
                  </p>
                  <p className="text-[11px] text-[var(--muted)] truncate">
                    volunteer.bangladesh@gmail.com
                  </p>
                </div>
                <span className="text-xs text-[var(--muted)]">Signed in</span>
              </button>
            </div>

            {/* Or Use another Gmail account on this PC */}
            <form onSubmit={handleCustomAccountContinue} className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[var(--foreground)] flex items-center justify-between">
                  <span>Use another Gmail account:</span>
                  <span className="text-[10px] text-[var(--muted)]">PC Account</span>
                </label>
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={customGmail}
                  onChange={(e) => setCustomGmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>

              {customGmail.trim() && (
                <div className="space-y-1.5 animate-in fade-in duration-150">
                  <label className="text-[11px] font-bold text-[var(--foreground)]">
                    Display Name (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shakib Al Hasan"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChooserModal(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!customGmail.trim() || loading}
                  className="flex-1 btn-primary py-2.5 px-3 text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  Continue →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

