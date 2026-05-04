"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

// Zod Schema for validation
const formSchema = z
  .object({
    name: z.string().min(1, "This field is required"),
    email: z.string().email("Please enter a valid email"),
    phone: z
      .string()
      .regex(/^[0-9]{10,15}$/, "Phone must be 10-15 digits")
      .optional()
      .or(z.literal("")),
    password: z.string().min(8, "Minimum length is 8"),
    confirmPassword: z.string().min(1, "This field is required"),
    role: z.enum(["CUSTOMER", "INSTRUCTOR"], {
      error: "Please select a role",
    }),
    businessName: z.string().optional(),
    address: z.string().optional(),
    description: z.string().optional(),
  })
  .refine(
    // Passwords must match
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  )
  .refine(
    // businessName required if PROVIDER
    (data) => {
      if (data.role === "INSTRUCTOR") {
        return !!data.businessName && data.businessName.length >= 1;
      }
      return true;
    },
    {
      message: "This field is required",
      path: ["businessName"],
    },
  )
  .refine(
    // address required if PROVIDER
    (data) => {
      if (data.role === "INSTRUCTOR") {
        return !!data.address && data.address.length >= 1;
      }
      return true;
    },
    {
      message: "This field is required",
      path: ["address"],
    },
  );

type RegisterFormData = z.infer<typeof formSchema>;

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "CUSTOMER",
      businessName: "",
      address: "",
      description: "",
    },
  });

  //  Watch role to show/hide provider fields
  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
  const toastId = toast.loading("Creating account...");
  try {
    // Step 1: Create user with Better Auth
    const { data: authData, error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      // @ts-expect-error - Better Auth additional fields
      phone: data.phone || "",
      role: data.role,
    });

    if (error) {
      toast.error(error.message, { id: toastId });
      return;
    }

    // Step 2: If Instructor, sign in first to establish session cookie,
    // then create the profile. signUp alone doesn't set the cookie in time.
    if (data.role === "INSTRUCTOR" && authData?.user) {
      toast.loading("Setting up your instructor profile...", { id: toastId });

      // Sign in to get a valid session cookie
      const { error: signInError } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        // User was created but profile couldn't be set up — still redirect to login
        toast.success("Account created! Please log in to complete setup.", {
          id: toastId,
        });
        router.push("/login");
        return;
      }

      // Now the session cookie exists — create the instructor profile
      await api.post("/instructor/profile", {
        businessName: data.businessName,
        address: data.address,
        description: data.description || "",
      });

      toast.success(
        "Account created! Your instructor application is pending approval.",
        { id: toastId },
      );
      // Redirect to instructor dashboard — they're already signed in
      router.push("/instructor/dashboard");
      return;
    }

    // Step 3: Customer registration — just go to login
    toast.success("Account created successfully! Please log in.", {
      id: toastId,
    });
    router.push("/login");
  } catch (err) {
    toast.error("Something went wrong, please try again", { id: toastId });
  }
};

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="register-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Name */}
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name")}
              />
              {errors.name && <FieldError errors={[errors.name]} />}
            </Field>

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

            {/* Phone */}
            <Field data-invalid={!!errors.phone}>
              <FieldLabel htmlFor="phone">Phone (optional)</FieldLabel>
              <Input
                id="phone"
                type="tel"
                placeholder="01700000000"
                {...register("phone")}
              />
              <FieldDescription>10-15 digit phone number</FieldDescription>
              {errors.phone && <FieldError errors={[errors.phone]} />}
            </Field>

            {/* Password */}
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Min 8 characters"
                {...register("password")}
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
              {errors.password && <FieldError errors={[errors.password]} />}
            </Field>

            {/* Confirm Password */}
            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <FieldError errors={[errors.confirmPassword]} />
              )}
            </Field>

            {/* Role - Dropdown */}
            <Field data-invalid={!!errors.role}>
              <FieldLabel htmlFor="role">I want to register as</FieldLabel>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CUSTOMER">
                        🛒 Customer - Take courses
                      </SelectItem>
                      <SelectItem value="INSTRUCTOR">
                        🎓 Instructor - Share knowledge
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldDescription>
                Select whether you want to learn or teach.
              </FieldDescription>
              {errors.role && <FieldError errors={[errors.role]} />}
            </Field>

            {/* Instructor Fields - Only shown when INSTRUCTOR selected */}
            {selectedRole === "INSTRUCTOR" && (
              <FieldGroup className="border rounded-lg p-4 bg-muted/30">
                <Field>
                  <FieldLabel>Instructor Information</FieldLabel>
                  <FieldDescription>
                    Fill in your school or studio details.
                  </FieldDescription>
                </Field>

                {/* Business Name */}
                <Field data-invalid={!!errors.businessName}>
                  <FieldLabel htmlFor="businessName">
                    School/Studio Name *
                  </FieldLabel>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="My Restaurant"
                    {...register("businessName")}
                  />
                  {errors.businessName && (
                    <FieldError errors={[errors.businessName]} />
                  )}
                </Field>

                {/* Address */}
                <Field data-invalid={!!errors.address}>
                  <FieldLabel htmlFor="address">School Address *</FieldLabel>
                  <Input
                    id="address"
                    type="text"
                    placeholder="123 Main Street, City"
                    {...register("address")}
                  />
                  {errors.address && <FieldError errors={[errors.address]} />}
                </Field>

                {/* Description */}
                <Field>
                  <FieldLabel htmlFor="description">
                    Description (optional)
                  </FieldLabel>
                  <Input
                    id="description"
                    type="text"
                    placeholder="Tell students about your expertise"
                    {...register("description")}
                  />
                  <FieldDescription>
                    A short description of your teaching background.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            )}
          </FieldGroup>
        </form>
      </CardContent>

      {/* Footer */}

      <CardFooter className="flex flex-col gap-5 justify-end">
        <Button
          form="register-form"
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
        <FieldDescription className="text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-primary underline underline-offset-4"
          >
            Sign in
          </a>
        </FieldDescription>
      </CardFooter>
    </Card>
  );
}
