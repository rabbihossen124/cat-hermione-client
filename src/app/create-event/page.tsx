import React, { Suspense } from "react";
import type { Metadata } from "next";
import CreateEventClient from "./CreateEventClient";

export const metadata: Metadata = {
  title: "Host a Community Drive | UnityAid",
  description:
    "Organize a local social welfare initiative, volunteer cleanup, or donation campaign in your city.",
};

export default function CreateEventPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-4 max-w-md mx-auto">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[var(--muted)]">
            Loading event creation form...
          </p>
        </div>
      }
    >
      <CreateEventClient />
    </Suspense>
  );
}

