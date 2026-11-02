"use client";

import React, { createContext, useContext, useState } from "react";
import { authClient } from "@/lib/auth-client";

export interface User {
  name: string;
  email: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, token?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Synchronous initial load from localStorage ensures no redirect on page reload
  const [localUser, setLocalUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("unityaid_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync Better-Auth session if available
  const { data: session, isPending } = authClient.useSession();

  const sessionUser: User | null = session?.user
    ? {
        name: session.user.name || "Community Volunteer",
        email: session.user.email,
        photoURL:
          session.user.image ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      }
    : null;

  // Active user: prefer Better-Auth session, fallback to local storage
  const user = sessionUser || localUser;

  const login = (userData: User, token?: string) => {
    setLocalUser(userData);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("unityaid_user", JSON.stringify(userData));
        if (token) {
          localStorage.setItem("unityaid_token", token);
        }
      } catch {
        // ignore storage errors
      }
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
    } catch {
      // ignore
    } finally {
      setLocalUser(null);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("unityaid_user");
          localStorage.removeItem("unityaid_token");
        } catch {
          // ignore storage errors
        }
      }
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: loading || isPending,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
