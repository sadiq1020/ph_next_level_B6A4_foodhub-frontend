"use client";

import {
  EnrollmentsPerCourseChart,
  InstructorRevenueChart,
  useInstructorCharts,
} from "@/components/charts/InstructorCharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { BookOpen, ChefHat, GraduationCap, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type InstructorStatus = "PENDING" | "APPROVED" | "REJECTED";

type InstructorProfile = {
  id: string;
  businessName: string;
  status: InstructorStatus;
  _count: { courses: number };
};

function ApprovalBanner({ status }: { status: InstructorStatus | null }) {
  if (!status) return null;

  if (status === "PENDING") {
    return (
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 mb-8">
        <span className="text-3xl mt-0.5">⏳</span>
        <div>
          <p className="font-semibold text-blue-900 dark:text-blue-100">Application Pending Review</p>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-0.5">
            Your instructor application is being reviewed. You&apos;ll be able to publish courses once approved.
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
          <p className="font-semibold text-green-900 dark:text-green-100">Account Approved</p>
          <p className="text-sm text-green-700 dark:text-green-300 mt-0.5">
            Your instructor account is active. Start publishing courses for students to enroll in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 mb-8">
      <span className="text-3xl mt-0.5">❌</span>
      <div>
        <p className="font-semibold text-red-900 dark:text-red-100">Application Rejected</p>
        <p className="text-sm text-red-700 dark:text-red-300 mt-0.5">
          Your instructor application was not approved. Please contact support.
        </p>
      </div>
    </div>
  );
}

export default function InstructorDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [profile, setProfile] = useState<InstructorProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const { enrollmentsPerCourse, revenueOverTime, isLoading: isLoadingCharts } =
    useInstructorCharts();

  useEffect(() => {
    if (!isPending && !session?.user) router.push("/login");
    if (!isPending && session?.user) {
      const role = (session.user as { role?: string }).role;
      if (role !== "INSTRUCTOR") router.push("/");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!session?.user) return;
    api.get("/instructor/profile")
      .then((data) => setProfile(data.data || data))
      .catch(() => {})
      .finally(() => setIsLoadingProfile(false));
  }, [session?.user?.id]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) return null;

  const user = session.user as { name: string };
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
                {isLoadingProfile ? "Loading..." : profile?.businessName || "Instructor Dashboard"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Approval banner */}
        <ApprovalBanner status={profile?.status ?? null} />

        {/* ── Charts — only shown when approved ── */}
        {isApproved && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Your Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EnrollmentsPerCourseChart
                data={enrollmentsPerCourse}
                isLoading={isLoadingCharts}
              />
              <InstructorRevenueChart
                data={revenueOverTime}
                isLoading={isLoadingCharts}
              />
            </div>
          </div>
        )}

        {/* Quick action cards */}
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`p-6 border border-zinc-200 dark:border-zinc-800 transition-all group ${isApproved ? "hover:border-orange-300 dark:hover:border-orange-700 cursor-pointer" : "opacity-60 cursor-not-allowed"}`}>
            <Link href={isApproved ? "/instructor/courses" : "#"} className="block" onClick={(e) => !isApproved && e.preventDefault()}>
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-50 mb-1">Add New Course</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                {isApproved ? "Add a new course and receive enrollments" : "Available after approval"}
              </p>
              <Button className="w-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-0 text-white text-xs" disabled={!isApproved} size="sm">
                Go to Courses
              </Button>
            </Link>
          </Card>

          <Card className="p-6 border border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group">
            <Link href="/instructor/orders" className="block">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-50 mb-1">Student Enrollments</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">Manage students enrolled in your courses</p>
              <Button variant="outline" className="w-full rounded-full text-xs" size="sm">View Enrollments</Button>
            </Link>
          </Card>

          <Card className="p-6 border border-zinc-200 dark:border-zinc-800 hover:border-green-300 dark:hover:border-green-700 transition-all cursor-pointer group">
            <Link href="/instructor/courses" className="block">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-50 mb-1">Manage Courses</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">Edit or remove existing courses</p>
              <Button variant="outline" className="w-full rounded-full text-xs" size="sm">Manage Courses</Button>
            </Link>
          </Card>

          <Card className="p-6 border border-zinc-200 dark:border-zinc-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer group">
            <Link href="/instructor/profile" className="block">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-50 mb-1">My Profile</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">Update your professional information</p>
              <Button variant="outline" className="w-full rounded-full text-xs" size="sm">Edit Profile</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}