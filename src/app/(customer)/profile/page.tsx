"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { User as UserType } from "@/types";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Phone must be 10-15 digits")
    .optional()
    .or(z.literal("")),
  email: z.string().email(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type InstructorStatus = "PENDING" | "APPROVED" | "REJECTED";

type InstructorProfile = {
  businessName: string;
  status: InstructorStatus;
  description?: string | null;
  address?: string | null;
};

// ── Instructor approval status card ──────────────────
function InstructorStatusCard({
  profile,
  isLoading,
}: {
  profile: InstructorProfile | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
        <Skeleton className="h-5 w-40 mb-4" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    );
  }

  if (!profile) return null;

  const STYLES = {
    PENDING: {
      wrapper:
        "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
      title: "text-blue-900 dark:text-blue-100",
      body: "text-blue-700 dark:text-blue-300",
      icon: "⏳",
      label: "Pending Approval",
      message:
        "Your instructor application is under review. You'll be notified once an admin approves your account.",
    },
    APPROVED: {
      wrapper:
        "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
      title: "text-green-900 dark:text-green-100",
      body: "text-green-700 dark:text-green-300",
      icon: "✅",
      label: "Account Approved",
      message:
        "Your instructor account is active. You can create and publish courses for students to enroll in.",
    },
    REJECTED: {
      wrapper:
        "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
      title: "text-red-900 dark:text-red-100",
      body: "text-red-700 dark:text-red-300",
      icon: "❌",
      label: "Application Rejected",
      message:
        "Your application was not approved. Please contact support for more information.",
    },
  };

  const s = STYLES[profile.status];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
        Instructor Status
      </h3>

      <div
        className={`flex items-start gap-4 p-4 rounded-xl border ${s.wrapper}`}
      >
        <span className="text-2xl mt-0.5">{s.icon}</span>
        <div>
          <p className={`font-semibold text-sm ${s.title}`}>{s.label}</p>
          <p className={`text-xs mt-0.5 leading-relaxed ${s.body}`}>
            {s.message}
          </p>
        </div>
      </div>

      {/* Instructor profile details */}
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-zinc-500 dark:text-zinc-400">
            School / Studio
          </span>
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            {profile.businessName}
          </span>
        </div>
        {profile.address && (
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400">Address</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-50 text-right max-w-[60%]">
              {profile.address}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [instructorProfile, setInstructorProfile] =
    useState<InstructorProfile | null>(null);
  const [isLoadingInstructor, setIsLoadingInstructor] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", phone: "", email: "" },
  });


  // Pre-fill form from session
  useEffect(() => {
    if (session?.user) {
      const u = session.user as unknown as UserType;
      reset({
        name: u.name || "",
        phone: u.phone || "",
        email: u.email || "",
      });
    }
  }, [session, reset]);

  // If INSTRUCTOR — fetch their profile to show approval status
  useEffect(() => {
    const role = (session?.user as { role?: string })?.role;
    if (role !== "INSTRUCTOR") return;

    const fetchProfile = async () => {
      try {
        setIsLoadingInstructor(true);
        const data = await api.get("/instructor/profile");
        setInstructorProfile(data.data || data);
      } catch {
        // no profile yet
      } finally {
        setIsLoadingInstructor(false);
      }
    };

    if (session?.user) fetchProfile();
  }, [session?.user?.id]);

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = session.user as unknown as UserType;
  const role = (session.user as { role?: string }).role || "CUSTOMER";

  // Back link depends on role
  const backHref =
    role === "ADMIN"
      ? "/admin/dashboard"
      : role === "INSTRUCTOR"
        ? "/instructor/dashboard"
        : "/";

  const onSubmit = async (data: ProfileFormData) => {
    const toastId = toast.loading("Updating profile...");
    try {
      await api.put("/users/profile", {
        name: data.name,
        phone: data.phone || null,
      });
      toast.success("Profile updated successfully!", { id: toastId });
      setTimeout(() => window.location.reload(), 800);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message, { id: toastId });
    }
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-6">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 -ml-2 mb-3"
          >
            <Link href={backHref}>
              <ArrowLeft className="w-4 h-4" />
              {role === "ADMIN"
                ? "Back to Admin"
                : role === "INSTRUCTOR"
                  ? "Back to Dashboard"
                  : "Back to Home"}
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            My Profile
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">
            Manage your account information
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">

        {/* Instructor approval status — only shown for INSTRUCTOR role */}
        {role === "INSTRUCTOR" && (
          <InstructorStatusCard
            profile={instructorProfile}
            isLoading={isLoadingInstructor}
          />
        )}

        {/* Profile edit form */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center">
              <User className="w-10 h-10 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                {user.name}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {user.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              {/* Name */}
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  {...register("name")}
                />
                <FieldDescription>
                  This is how your name appears on the platform
                </FieldDescription>
                {errors.name && <FieldError errors={[errors.name]} />}
              </Field>

              {/* Email — read only */}
              <Field>
                <FieldLabel htmlFor="email">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  disabled
                  {...register("email")}
                  className="bg-zinc-50 dark:bg-zinc-800 cursor-not-allowed opacity-60"
                />
                <FieldDescription>Email cannot be changed</FieldDescription>
              </Field>

              {/* Phone */}
              <Field data-invalid={!!errors.phone}>
                <FieldLabel htmlFor="phone">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01700000000"
                  {...register("phone")}
                />
                <FieldDescription>Optional — 10–15 digits</FieldDescription>
                {errors.phone && <FieldError errors={[errors.phone]} />}
              </Field>
            </FieldGroup>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  reset({
                    name: user.name || "",
                    phone: user.phone || "",
                    email: user.email || "",
                  })
                }
                disabled={isSubmitting}
                className="rounded-full"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-0 text-white px-8"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>

        {/* Account info card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Account Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">
                Account Type
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-50 capitalize">
                {role.toLowerCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">
                Member Since
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                {memberSince}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}