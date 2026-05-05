"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Minimum length is 8"),
});

type LoginFormData = z.infer<typeof formSchema>;

const DEMO_ACCOUNTS = [
  {
    label: "Admin",
    icon: "🛡️",
    email: "admin@sadiq2.com",
    password: "admin1234",
    color:
      "border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-purple-700 dark:text-purple-300",
    badge:
      "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300",
  },
  {
    label: "Instructor",
    icon: "👨‍🍳",
    email: "marco@test.com",
    password: "12345678",
    color:
      "border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-orange-700 dark:text-orange-300",
    badge:
      "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-300",
  },
  {
    label: "Student",
    icon: "🎓",
    email: "student@test.com",
    password: "12345678",
    color:
      "border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-700 dark:text-blue-300",
    badge: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300",
  },
];

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleDemoLogin = async (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);

    const toastId = toast.loading("Logging in as demo user...");
    try {
      const { data: authData, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message, { id: toastId });
        return;
      }

      toast.success("Logged in successfully!", { id: toastId });

      const role = (authData?.user as { role?: string })?.role ?? "";
      if (role === "ADMIN") router.replace("/admin/dashboard");
      else if (role === "INSTRUCTOR") router.replace("/instructor/dashboard");
      else router.replace("/");
    } catch {
      toast.error("Something went wrong, please try again", { id: toastId });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        // Redirect to frontend root after Google auth completes.
        // window.location.origin works on both localhost and Vercel.
        callbackURL: window.location.origin,
      });
    } catch {
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    const toastId = toast.loading("Logging in...");
    try {
      const { data: authData, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message, { id: toastId });
        return;
      }

      toast.success("Logged in successfully!", { id: toastId });

      const role = (authData?.user as { role?: string })?.role ?? "";
      if (role === "ADMIN") router.replace("/admin/dashboard");
      else if (role === "INSTRUCTOR") router.replace("/instructor/dashboard");
      else router.replace("/");
    } catch {
      toast.error("Something went wrong, please try again", { id: toastId });
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to sign in to your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ── Demo login buttons ──────────────────────── */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Quick Demo Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.label}
                type="button"
                onClick={() =>
                  handleDemoLogin(account.email, account.password)
                }
                disabled={isSubmitting}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${account.color}`}
              >
                <span className="text-xl">{account.icon}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${account.badge}`}
                >
                  {account.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Google sign-in ──────────────────────────── */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GoogleIcon />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Continue with Google
          </span>
        </button>

        {/* ── Divider ─────────────────────────────────── */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-200 dark:border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-3 text-zinc-400">
              or sign in with email
            </span>
          </div>
        </div>

        {/* ── Manual form ─────────────────────────────── */}
        <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email && <FieldError errors={[errors.email]} />}
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && <FieldError errors={[errors.password]} />}
            </Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-5 justify-end">
        <Button
          form="login-form"
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
        <FieldDescription className="text-center">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-primary underline underline-offset-4"
          >
            Sign up
          </a>
        </FieldDescription>
      </CardFooter>
    </Card>
  );
}