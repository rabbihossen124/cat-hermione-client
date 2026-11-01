import React, { Suspense } from "react";
import EventDetailsClient from "./EventDetailsClient";

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-4 max-w-md mx-auto">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[var(--muted)]">
            Loading community drive details...
          </p>
        </div>
      }
    >
      <EventDetailsClient params={params} />
    </Suspense>
  );
}
