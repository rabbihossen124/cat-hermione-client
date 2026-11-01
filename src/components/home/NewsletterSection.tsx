"use client";

import React, { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      setStatus("error");
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    setStatus("loading");
    // Simulate instantaneous client-side subscription
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 500);
  };

  return (
    <section className="relative overflow-hidden card-breeds p-8 sm:p-14 lg:p-16 bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-[var(--accent)] border border-[var(--border)] shadow-sm">
      {/* Decorative Background Orbs */}
      <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-[#0D9488]/10 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#FF6B00]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[var(--accent)] text-[var(--accent-foreground)] border border-[var(--primary)]/20 shadow-xs">
          <span>📬 Community Dispatch & Alerts</span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--foreground)] leading-tight">
          Never Miss a Volunteer{" "}
          <span className="text-[var(--primary)]">Opportunity</span> Near You
        </h2>

        {/* Subtitle (No Lorem Ipsum!) */}
        <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed max-w-xl mx-auto">
          Subscribe to our weekly dispatch for verified social welfare drives, emergency relief alerts, and grassroots volunteer meetups across Dhaka, Khulna, and beyond. Zero spam, strictly community impact.
        </p>

        {/* Subscription Form */}
        {status === "success" ? (
          <div className="p-5 rounded-2xl bg-[#0D9488]/10 border border-[#0D9488]/30 text-[#0D9488] space-y-1.5 animate-in fade-in duration-300">
            <div className="text-2xl">🎉</div>
            <h3 className="text-sm font-extrabold text-[var(--foreground)]">
              Thank You for Joining the Movement!
            </h3>
            <p className="text-xs text-[var(--muted)]">
              You will receive our weekly community impact digest every Sunday morning.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-2.5 p-2 rounded-3xl sm:rounded-full bg-[var(--card)] border border-[var(--border)] shadow-lg shadow-black/5 max-w-xl mx-auto"
          >
            <div className="flex-1 flex items-center gap-3 px-4 w-full">
              <span className="text-base">✉️</span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="Enter your email (e.g. volunteer@unityaid.org)"
                className="w-full text-xs sm:text-sm bg-transparent outline-none text-[var(--foreground)] placeholder-[var(--muted)]"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary text-xs sm:text-sm py-3 px-7 w-full sm:w-auto shadow-md"
            >
              {status === "loading" ? "Subscribing..." : "Get Weekly Alerts"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-xs text-red-500 font-semibold animate-in fade-in duration-200">
            {errorMessage}
          </p>
        )}

        {/* Trust Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--muted)]">
          <div className="flex items-center gap-1.5">
            <span className="text-[#0D9488]">✓</span>
            <span>100% Privacy Protected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#FF6B00]">✓</span>
            <span>Weekly Digest Every Sunday</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-blue-500">✓</span>
            <span>Unsubscribe Anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}

