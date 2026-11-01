"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-16 mb-8">
      <div className="card-breeds p-8 sm:p-12 bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF6B00] to-[#FFA04D] flex items-center justify-center text-white text-lg shadow-md shadow-orange-500/20">
                🤝
              </div>
              <span className="font-black text-xl tracking-tight text-[var(--foreground)]">
                Unity<span className="text-[var(--primary)]">Aid</span>
              </span>
            </Link>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              A community-first social service network connecting passionate volunteers with impactful local development initiatives across Dhaka and nearby neighborhoods.
            </p>
            {/* Social Icons including the new X logo (Strict Assignment Rebrand Requirement) */}
            <div className="flex items-center gap-3 pt-2">
              {/* New X Logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow UnityAid on X (formerly Twitter)"
                className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="UnityAid on Facebook"
                className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="UnityAid on LinkedIn"
                className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="UnityAid on GitHub"
                className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Explore Platform
            </h4>
            <ul className="space-y-2 text-xs text-[var(--muted)]">
              <li>
                <Link href="/" className="hover:text-[var(--primary)] transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/upcoming-events" className="hover:text-[var(--primary)] transition-colors">
                  Upcoming Social Drives
                </Link>
              </li>
              <li>
                <Link href="/create-event" className="hover:text-[var(--primary)] transition-colors">
                  Create an Event
                </Link>
              </li>
              <li>
                <Link href="/joined-events" className="hover:text-[var(--primary)] transition-colors">
                  Track Joined Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Event Categories
            </h4>
            <ul className="space-y-2 text-xs text-[var(--muted)]">
              <li>
                <span className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                  🧥 Winter Clothes & Blanket Drives
                </span>
              </li>
              <li>
                <span className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                  🧹 Neighborhood Cleanups
                </span>
              </li>
              <li>
                <span className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                  🌱 Tree Plantation & Green City
                </span>
              </li>
              <li>
                <span className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                  🩺 Free Community Health Camps
                </span>
              </li>
              <li>
                <span className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                  📚 Street Children Education
                </span>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Community Hub
            </h4>
            <div className="space-y-2 text-xs text-[var(--muted)]">
              <p className="flex items-center gap-2">
                <span>📍</span> Mirpur 10, Dhaka 1216, Bangladesh
              </p>
              <p className="flex items-center gap-2">
                <span>✉️</span> volunteer@unityaid-events.org
              </p>
              <p className="flex items-center gap-2">
                <span>📞</span> +880 1700-123456
              </p>
              <div className="pt-2">
                <span className="badge-pill bg-[#0D9488]/15 text-[#0D9488]">
                  ● 24/7 Volunteer Support
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted)]">
          <p>© 2026 UnityAid Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[var(--foreground)] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[var(--foreground)] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[var(--foreground)] cursor-pointer">Community Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
