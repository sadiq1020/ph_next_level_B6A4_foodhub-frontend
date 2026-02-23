import { env } from "@/env";
import { createAuthClient } from "better-auth/react";

// export const authClient = createAuthClient({
//   baseURL: env.NEXT_PUBLIC_API_URL,
// });

// trying solution cookies after deployment
export const authClient = createAuthClient({
  // baseURL: env.NEXT_PUBLIC_API_URL,
  baseURL: `${env.NEXT_PUBLIC_FRONTEND_URL}/api/auth`, // ✅ Changed - points to frontend proxy
  // ✅ Add fetch options for cross-domain cookies
  fetchOptions: {
    credentials: "include", // Send cookies with cross-domain requests
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
