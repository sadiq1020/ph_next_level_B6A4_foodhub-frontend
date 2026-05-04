import { env } from "@/env";
import { createAuthClient } from "better-auth/react";

// export const authClient = createAuthClient({
//   baseURL: env.NEXT_PUBLIC_API_URL,
// });

// trying solution cookies after deployment
export const authClient = createAuthClient({
  // baseURL: env.NEXT_PUBLIC_API_URL,
  // ✅ Dynamically use current origin in browser, fall back to env for SSR
  baseURL: typeof window !== "undefined" 
    ? `${window.location.origin}/api/auth` 
    : `${env.NEXT_PUBLIC_FRONTEND_URL}/api/auth`,
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
