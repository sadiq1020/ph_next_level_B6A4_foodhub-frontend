import { env } from "@/env";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});
