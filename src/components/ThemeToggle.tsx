"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      suppressHydrationWarning
      aria-label="Toggle light and dark theme mode"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] shadow-xs"
    >
      <span className="text-sm" suppressHydrationWarning>
        {theme === "light" ? "🌙" : "☀️"}
      </span>
      <span className="hidden sm:inline" suppressHydrationWarning>
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </span>
    </button>
  );
}
