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

// ── Zod Schema ────────────────────────────────────────
const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Minimum length is 8"),
});

type LoginFormData = z.infer<typeof formSchema>;

// ── Demo accounts ─────────────────────────────────────
const DEMO_ACCOUNTS = [
  {
    label: "Admin",
    icon: "🛡️",
    email: "admin@sadiq2.com",
    password: "admin1234",
    color:
      "border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-purple-700 dark:text-purple-300",
    badge: "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300",
  },
  {
    label: "Instructor",
    icon: "👨‍🍳",
    email: "marco@test.com",
    password: "12345678",
    color:
      "border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-orange-700 dark:text-orange-300",
    badge: "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-300",
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

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Auto-fill credentials and submit immediately
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
      if (role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else if (role === "INSTRUCTOR") {
        router.replace("/instructor/dashboard");
      } else {
        router.replace("/");
      }
    } catch {
      toast.error("Something went wrong, please try again", { id: toastId });
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
      if (role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else if (role === "INSTRUCTOR") {
        router.replace("/instructor/dashboard");
      } else {
        router.replace("/");
      }
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

        {/* ── Divider ─────────────────────────────────── */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-200 dark:border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-3 text-zinc-400">
              or sign in manually
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

      {/* Footer */}
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