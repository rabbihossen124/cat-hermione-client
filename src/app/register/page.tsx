import React, { Suspense } from "react";
import type { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Join UnityAid | Register Volunteer Account",
  description:
    "Create your UnityAid account to organize social welfare initiatives and join grassroots community drives.",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-4 max-w-md mx-auto">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[var(--muted)]">Loading registration...</p>
        </div>
      }
    >
      <RegisterClient />
    </Suspense>
  );
}

