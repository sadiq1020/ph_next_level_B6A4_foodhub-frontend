// import { env } from "@/env";
// import { createAuthClient } from "better-auth/react";

// // export const authClient = createAuthClient({
// //   baseURL: env.NEXT_PUBLIC_API_URL,
// // });

// // trying solution cookies after deployment
// export const authClient = createAuthClient({
//   // baseURL: env.NEXT_PUBLIC_API_URL,
//   // ✅ Dynamically use current origin in browser, fall back to env for SSR
//   baseURL: typeof window !== "undefined" 
//     ? `${window.location.origin}/api/auth` 
//     : `${env.NEXT_PUBLIC_FRONTEND_URL}/api/auth`,
//   fetchOptions: {
//     credentials: "include",
//   },
// });

// export const { signIn, signUp, signOut, useSession } = authClient;

import { createAuthClient } from "better-auth/react";

// Points to the frontend origin — Next.js rewrites proxy
// /api/auth/* → backend automatically via next.config.ts.
// Using window.location.origin (not hardcoded URL) means it works
// on both localhost:3000 and the deployed Vercel URL without any changes.
export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
