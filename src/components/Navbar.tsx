"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

// React 19 official zero-cascading-render mounted store
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const mounted = useMounted();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    toast.info("Signed out successfully! See you soon 👋");
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-4 z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 mb-6">
      <div className="card-breeds px-5 py-3.5 flex items-center justify-between backdrop-blur-md bg-[var(--card)]/90 shadow-sm border border-[var(--border)]">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B00] to-[#FFA04D] flex items-center justify-center text-white text-xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            🤝
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-[var(--foreground)]">
              Unity<span className="text-[var(--primary)]">Aid</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider text-[#0D9488] ml-2 px-2 py-0.5 rounded-full bg-[#0D9488]/10 border border-[#0D9488]/20">
              Community
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[var(--muted)]">
          <Link
            href="/"
            className="hover:text-[var(--primary)] transition-colors py-1"
          >
            Home
          </Link>
          <Link
            href="/upcoming-events"
            className="hover:text-[var(--primary)] transition-colors py-1"
          >
            Upcoming Events
          </Link>
        </nav>

        {/* Right Action Section */}
        <div className="flex items-center gap-3">
          {/* Light/Dark Mode Toggle */}
          <ThemeToggle />

          {/* Conditional Login / Profile Picture Dropdown */}
          {mounted && user ? (
            <div className="relative flex items-center gap-2" ref={dropdownRef}>
              {/* Profile Picture with Hover Tooltip Display Name */}
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title={user.name}
                aria-label="User profile and navigation menu"
                className="group relative flex items-center gap-2 p-1 rounded-full border border-[var(--border)] hover:border-[var(--primary)] transition-all cursor-pointer bg-[var(--card)]"
              >
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[var(--primary)]/50"
                    unoptimized
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6B00] to-[#0D9488] text-white flex items-center justify-center font-bold text-xs ring-2 ring-[var(--primary)]/50">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <span className="hidden lg:inline text-xs font-bold text-[var(--foreground)] pr-1 max-w-[120px] truncate">
                  {user.name}
                </span>

                {/* Hover display name tooltip */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--foreground)] text-[var(--background)] text-[11px] font-semibold py-1 px-2.5 rounded-md whitespace-nowrap shadow-md z-30">
                  {user.name}
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-52 card-breeds p-2 shadow-xl bg-[var(--card)] border border-[var(--border)] z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                    <p className="text-xs font-bold text-[var(--foreground)] truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-[var(--muted)] truncate">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/create-event"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-colors"
                  >
                    <span>➕</span> Create Event
                  </Link>

                  <Link
                    href="/manage-events"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-colors"
                  >
                    <span>🛠️</span> Manage Events
                  </Link>

                  <Link
                    href="/joined-events"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-colors"
                  >
                    <span>📌</span> Joined Events
                  </Link>

                  <div className="border-t border-[var(--border)] mt-1 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                    >
                      <span>🚪</span> Logout
                    </button>
                  </div>
                </div>
              )}

              {/* Direct Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:inline-flex btn-outline text-xs py-1.5 px-3"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary text-xs py-2 px-4 shadow-sm">
              Login
            </Link>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[var(--foreground)] border border-[var(--border)] bg-[var(--card)]"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 card-breeds p-4 bg-[var(--card)] border border-[var(--border)] shadow-lg space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[var(--foreground)] hover:text-[var(--primary)] py-1"
          >
            Home
          </Link>
          <Link
            href="/upcoming-events"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[var(--foreground)] hover:text-[var(--primary)] py-1"
          >
            Upcoming Events
          </Link>
          {mounted && user && (
            <>
              <hr className="border-[var(--border)]" />
              <Link
                href="/create-event"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-[var(--foreground)] hover:text-[var(--primary)] py-1"
              >
                ➕ Create Event
              </Link>
              <Link
                href="/manage-events"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-[var(--foreground)] hover:text-[var(--primary)] py-1"
              >
                🛠️ Manage Events
              </Link>
              <Link
                href="/joined-events"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-[var(--foreground)] hover:text-[var(--primary)] py-1"
              >
                📌 Joined Events
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

