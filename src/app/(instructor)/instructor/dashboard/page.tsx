"use client";

import { BookOpen, ChefHat, GraduationCap, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

type InstructorStatus = "PENDING" | "APPROVED" | "REJECTED";

type InstructorProfile = {
  id: string;
  businessName: string;
  status: InstructorStatus;
  _count: { courses: number };
};

// ── Approval Status Banner ────────────────────────────
function ApprovalBanner({
  status,
  isLoading,
}: {
  status: InstructorStatus | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <Skeleton className="h-20 w-full rounded-2xl mb-8" />;
  }

  if (!status) return null;

  if (status === "PENDING") {
    return (
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 mb-8">
        <span className="text-3xl mt-0.5">⏳</span>
        <div>
          <p className="font-semibold text-blue-900 dark:text-blue-100">
            Application Pending Review
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-0.5">
            Your instructor application is being reviewed by our admin team.
            You&apos;ll be able to publish courses once approved. Check back
            later or refresh the page.
          </p>
        </div>
      </div>
    );
  }

  if (status === "APPROVED") {
    return (
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 mb-8">
        <span className="text-3xl mt-0.5">✅</span>
        <div>
          <p className="font-semibold text-green-900 dark:text-green-100">
            Account Approved
          </p>
          <p className="text-sm text-green-700 dark:text-green-300 mt-0.5">
            Your instructor account is active. You can now create and publish
            courses for students to enroll in.
          </p>
        </div>
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 mb-8">
        <span className="text-3xl mt-0.5">❌</span>
        <div>
          <p className="font-semibold text-red-900 dark:text-red-100">
            Application Rejected
          </p>
          <p className="text-sm text-red-700 dark:text-red-300 mt-0.5">
            Your instructor application was not approved. Please contact
            support for more information.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

// ── Page ──────────────────────────────────────────────
export default function InstructorDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [profile, setProfile] = useState<InstructorProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Protected route — INSTRUCTOR only
  useEffect(() => {
    if (!isPending && !session?.user) router.push("/login");
    if (!isPending && session?.user) {
      const role = (session.user as { role?: string }).role;
      if (role !== "INSTRUCTOR") router.push("/");
    }
  }, [session, isPending, router]);

  // Fetch instructor profile to get live approval status
  // We always fetch fresh (no cache) so the status reflects
  // any admin approval/rejection since last visit
  useEffect(() => {
    if (!session?.user) return;

    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const data = await api.get("/instructor/profile");
        setProfile(data.data || data);
      } catch {
        // profile fetch failed — don't crash the dashboard
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [session?.user?.id]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) return null;

  const user = session.user as { name: string; role?: string };
  const isApproved = profile?.status === "APPROVED";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Welcome back, {user.name}!
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                {isLoadingProfile
                  ? "Loading..."
                  : profile?.businessName || "Instructor Dashboard"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Approval status banner — always shows current status */}
        <ApprovalBanner
          status={profile?.status ?? null}
          isLoading={isLoadingProfile}
        />

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Add New Course — disabled if not approved */}
            <Card
              className={`p-8 border border-zinc-200 dark:border-zinc-800 transition-all group ${
                isApproved
                  ? "hover:border-orange-300 dark:hover:border-orange-700 cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
              }`}
            >
              <Link
                href={isApproved ? "/instructor/courses" : "#"}
                className="block"
                onClick={(e) => !isApproved && e.preventDefault()}
              >
                <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Plus className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                  Add New Course
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  {isApproved
                    ? "Add a new course and start receiving enrollments"
                    : "Available after your application is approved"}
                </p>
                <Button
                  className="w-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-0 text-white"
                  disabled={!isApproved}
                >
                  Go to Courses
                </Button>
              </Link>
            </Card>

            {/* View Enrollments */}
            <Card className="p-8 border border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group">
              <Link href="/instructor/orders" className="block">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                  Student Enrollments
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  View and manage students enrolled in your courses
                </p>
                <Button variant="outline" className="w-full rounded-full">
                  View Enrollments
                </Button>
              </Link>
            </Card>

            {/* Manage Courses */}
            <Card className="p-8 border border-zinc-200 dark:border-zinc-800 hover:border-green-300 dark:hover:border-green-700 transition-all cursor-pointer group">
              <Link href="/instructor/courses" className="block">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                  Manage Courses
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  Edit or remove existing courses from your list
                </p>
                <Button variant="outline" className="w-full rounded-full">
                  Manage Courses
                </Button>
              </Link>
            </Card>

            {/* Profile */}
            <Card className="p-8 border border-zinc-200 dark:border-zinc-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer group">
              <Link href="/instructor/profile" className="block">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                  My Profile
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  Update your professional information and contact details
                </p>
                <Button variant="outline" className="w-full rounded-full">
                  Edit Profile
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}