import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="card-breeds max-w-md w-full p-8 sm:p-10 text-center space-y-6 bg-[var(--card)] border border-[var(--border)] shadow-lg">
        {/* Animated Badge */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[var(--accent)] text-[var(--primary)] flex items-center justify-center text-3xl font-black shadow-inner">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight">
            Event Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
            The community service drive or page you are looking for does not exist, has concluded, or is currently under setup.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="btn-primary w-full sm:w-auto text-xs py-2.5 px-6">
            Back to Home
          </Link>
          <Link href="/upcoming-events" className="btn-outline w-full sm:w-auto text-xs py-2.5 px-6">
            View All Events
          </Link>
        </div>
      </div>
    </div>
  );
}

