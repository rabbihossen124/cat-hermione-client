import React, { Suspense } from "react";
import type { Metadata } from "next";
import UpcomingEventsClient from "./UpcomingEventsClient";

export const metadata: Metadata = {
  title: "Upcoming Community Drives | UnityAid",
  description:
    "Explore, filter, and join verified local social service drives across Dhaka, Khulna, Jashore, and Rangpur.",
};

export default function UpcomingEventsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-4 max-w-md mx-auto">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[var(--muted)]">
            Loading upcoming community events...
          </p>
        </div>
      }
    >
      <UpcomingEventsClient />
    </Suspense>
  );
}

