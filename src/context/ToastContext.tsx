"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const toast = React.useMemo(
    () => ({
      success: (msg: string) => addToast("success", msg),
      error: (msg: string) => addToast("error", msg),
      info: (msg: string) => addToast("info", msg),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Floating Top-Center Notification Stack */}
      <div
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2.5 pointer-events-none w-full max-w-md px-4"
        aria-live="polite"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto w-full flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-md border animate-in slide-in-from-top-4 fade-in duration-300 transition-all ${
              item.type === "success"
                ? "bg-emerald-500/95 text-white border-emerald-400/50 shadow-emerald-500/20"
                : item.type === "error"
                ? "bg-rose-500/95 text-white border-rose-400/50 shadow-rose-500/20"
                : "bg-slate-900/95 dark:bg-slate-800/95 text-white border-slate-700/60 shadow-black/30"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-lg shrink-0">
                {item.type === "success" && "🎉"}
                {item.type === "error" && "⚠️"}
                {item.type === "info" && "ℹ️"}
              </span>
              <p className="text-xs sm:text-sm font-bold tracking-tight truncate leading-snug">
                {item.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(item.id)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors shrink-0 cursor-pointer"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return {
    ...context.toast,
    toast: context.toast,
  };
}
