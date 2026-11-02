import React, { Suspense } from "react";
import type { Metadata } from "next";
import JoinedEventsClient from "./JoinedEventsClient";

export const metadata: Metadata = {
  title: "My Joined Events | UnityAid",
  description:
    "Review and manage the social welfare events and grassroots community drives you have registered to volunteer for.",
};

export default function JoinedEventsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-4 max-w-md mx-auto">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[var(--muted)]">
            Loading your joined drives...
          </p>
        </div>
      }
    >
      <JoinedEventsClient />
    </Suspense>
  );
}

