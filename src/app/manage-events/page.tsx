import React, { Suspense } from "react";
import type { Metadata } from "next";
import ManageEventsClient from "./ManageEventsClient";

export const metadata: Metadata = {
  title: "Manage Hosted Drives | UnityAid",
  description:
    "Review, update, and manage the grassroots social service initiatives you have organized on UnityAid.",
};

export default function ManageEventsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-4 max-w-md mx-auto">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[var(--muted)]">
            Loading organizer dashboard...
          </p>
        </div>
      }
    >
      <ManageEventsClient />
    </Suspense>
  );
}

