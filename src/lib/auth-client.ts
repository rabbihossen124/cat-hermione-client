"use client";

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ||
        "https://cat-hermione-client-five.vercel.app",
  plugins: [jwtClient()],
});

export const { signIn, signUp, useSession, signOut } = authClient;

