// import { createEnv } from "@t3-oss/env-nextjs";
// import { z } from "zod";

// export const env = createEnv({
//   server: {
//     // Only available on server - never exposed to browser
//     NODE_ENV: z.enum(["development", "test", "production"]),
//   },
//   client: {
//     // MUST start with NEXT_PUBLIC_
//     NEXT_PUBLIC_API_URL: z.string().url(),
//     NEXT_PUBLIC_APP_URL: z.string().url(),
//   },
//   runtimeEnv: {
//     NODE_ENV: process.env.NODE_ENV,
//     NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
//     NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
//   },
// });

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Only available on server - never exposed to browser
    NODE_ENV: z.enum(["development", "test", "production"]),
    BACKEND_URL: z.string().url(), // ✅ Add this
    BETTER_AUTH_SECRET: z.string().min(32), // ✅ Add this
  },
  client: {
    // MUST start with NEXT_PUBLIC_
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_FRONTEND_URL: z.string().url(), // ✅ Add this
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    BACKEND_URL: process.env.BACKEND_URL, // ✅ Add this
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET, // ✅ Add this
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL, // ✅ Add this
  },
});
