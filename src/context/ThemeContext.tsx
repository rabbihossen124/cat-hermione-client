"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Listen to storage events across tabs/windows
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("unityaid-theme-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("unityaid-theme-change", callback);
  };
}

function getClientSnapshot(): Theme {
  try {
    const saved = localStorage.getItem("unityaid-theme");
    if (saved === "dark") return "dark";
    if (saved === "light") return "light";
    return "light";
  } catch {
    return "light";
  }
}

function getServerSnapshot(): Theme {
  return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Officially recommended React 19 external store hook for localStorage
  const theme = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  // Synchronize <html> root class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    try {
      localStorage.setItem("unityaid-theme", nextTheme);
      // Dispatch custom event for immediate re-render across components
      window.dispatchEvent(new Event("unityaid-theme-change"));
    } catch {
      // ignore
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
