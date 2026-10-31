"use client";

import React, { createContext, useContext, useState } from "react";

export interface User {
  name: string;
  email: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, token?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Synchronous initial load from localStorage ensures no redirect on page reload
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("unityaid_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const loading = false;

  const login = (userData: User, token?: string) => {
    setUser(userData);
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

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("unityaid_user");
        localStorage.removeItem("unityaid_token");
      } catch {
        // ignore storage errors
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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

