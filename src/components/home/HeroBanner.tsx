"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HeroBanner() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchTerm.trim()) query.set("search", searchTerm.trim());
    if (category !== "all") query.set("type", category);
    router.push(`/upcoming-events?${query.toString()}`);
  };

  return (
    <section className="relative overflow-hidden card-breeds p-8 sm:p-14 lg:p-16 mb-12 bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-[var(--accent)] border border-[var(--border)] shadow-sm">
      {/* Background Soft Glow Orbs */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#FF6B00]/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#0D9488]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[var(--accent)] text-[var(--accent-foreground)] border border-[var(--primary)]/20 shadow-xs">
          <span>🤝 Community Welfare & Social Development Network</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--foreground)] leading-[1.15]">
          Unite for Change,{" "}
          <span className="text-[var(--primary)]">Serve Your Local</span>{" "}
          Community
        </h1>

        {/* Hero Description (No Lorem Ipsum!) */}
        <p className="text-xs sm:text-base text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
          Discover, create, and join impactful grassroots social service events
          around your neighborhood — from winter blanket distributions and
          environmental cleanups to tree plantation and community health camps.
        </p>

        {/* Breeds Signature Floating Pill Search Filter Bar */}
        <div className="pt-2 max-w-2xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-center gap-2 p-2 sm:p-2.5 rounded-3xl sm:rounded-full bg-[var(--card)] border border-[var(--border)] shadow-lg shadow-black/5"
          >
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-2.5 px-4 w-full">
              <span className="text-base">🔍</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search event e.g. Winter Clothes, Mirpur, Cleanup..."
                className="w-full text-xs sm:text-sm bg-transparent outline-none text-[var(--foreground)] placeholder-[var(--muted)]"
              />
            </div>

            {/* Divider */}
            <div className="h-6 w-[1px] bg-[var(--border)] hidden sm:block" />

            {/* Category Filter Dropdown */}
            <div className="flex items-center gap-2 px-4 w-full sm:w-auto">
              <span className="text-xs">📂</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter events by category"
                className="text-xs sm:text-sm bg-transparent outline-none text-[var(--foreground)] cursor-pointer pr-2"
              >
                <option value="all" className="bg-[var(--card)] text-[var(--foreground)]">All Types</option>
                <option value="Donation" className="bg-[var(--card)] text-[var(--foreground)]">Donation</option>
                <option value="Cleanup" className="bg-[var(--card)] text-[var(--foreground)]">Cleanup</option>
                <option value="Plantation" className="bg-[var(--card)] text-[var(--foreground)]">Plantation</option>
                <option value="Medical Aid" className="bg-[var(--card)] text-[var(--foreground)]">Medical Aid</option>
                <option value="Education" className="bg-[var(--card)] text-[var(--foreground)]">Education</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary text-xs sm:text-sm py-3 px-7 w-full sm:w-auto shadow-md"
            >
              Find Events
            </button>
          </form>
        </div>

        {/* Action Buttons & Highlights */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link href="/upcoming-events" className="btn-secondary text-xs sm:text-sm">
            Explore All Drives →
          </Link>
          <Link href="/create-event" className="btn-outline text-xs sm:text-sm">
            Host Community Event
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--muted)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
            <strong className="text-[var(--foreground)]">100%</strong> Non-profit Transparency
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            <strong className="text-[var(--foreground)]">Verified</strong> Community Organizers
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <strong className="text-[var(--foreground)]">Dhaka City</strong> Grassroots Network
          </div>
        </div>
      </div>
    </section>
  );
}

