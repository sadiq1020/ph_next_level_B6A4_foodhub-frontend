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

// Zod Schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Minimum length is 8"),
});

type LoginFormData = z.infer<typeof formSchema>;

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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

      // ✅ Wait briefly for the session cookie to fully propagate before
      // navigating to a protected route. Without this, the proxy's get-session
      // call races against the cookie being set and sometimes sees no session,
      // causing a redirect back to /login (especially for /provider/* routes).
      // await new Promise((resolve) => setTimeout(resolve, 300));

      // Redirect based on role — use replace() so login isn't in history
      const role = (authData?.user as { role?: string })?.role ?? "";

      if (role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else if (role === "PROVIDER") {
        router.replace("/provider/dashboard");
      } else {
        router.replace("/"); // Customer goes to home
      }
    } catch (err) {
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

      <CardContent>
        <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Email */}
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

            {/* Password */}
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
