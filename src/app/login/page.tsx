import React, { Suspense } from "react";
import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Sign In | UnityAid",
  description:
    "Log in to your UnityAid account to host community events and track your volunteer activities.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-4 max-w-md mx-auto">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[var(--muted)]">Loading sign in...</p>
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}

