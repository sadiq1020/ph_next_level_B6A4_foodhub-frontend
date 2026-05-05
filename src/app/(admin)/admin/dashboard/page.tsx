"use client";

import { QuickActionCard } from "@/components/admin/QuickActionCard";
import { StatCard } from "@/components/admin/StatCard";
import {
  EnrollmentTrendChart,
  RevenueBarChart,
  UserRolePieChart,
} from "@/components/charts/AdminCharts";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import {
  GraduationCap,
  List,
  Package,
  Settings,
  ShoppingBag,
  UserCog,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type AdminStats = {
  totalUsers: number;
  totalCustomers: number;
  totalInstructors: number;
  totalOrders: number;
  totalCategories: number;
  pendingInstructors: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!isPending && !session?.user) router.push("/login");
    if (!isPending && session?.user) {
      const userRole = (session.user as { role?: string }).role;
      if (userRole !== "ADMIN") router.push("/");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!session?.user) return;
    if (hasFetched.current) return;

    const fetchStats = async () => {
      try {
        hasFetched.current = true;
        setIsLoading(true);
        const data = await api.get("/admin/stats");
        setStats(data.data || data);
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
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
  const pendingCount = stats?.pendingInstructors ?? 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950" suppressHydrationWarning>
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center">
              <Settings className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Admin Dashboard
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                Welcome back, {user.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Pending applications alert */}
        {!isLoading && pendingCount > 0 && (
          <div
            onClick={() => router.push("/admin/instructors")}
            className="flex items-center gap-4 p-4 mb-8 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                {pendingCount} instructor application{pendingCount !== 1 ? "s" : ""} waiting for review
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                Click to review and approve or reject
              </p>
            </div>
            <span className="text-blue-500 text-sm font-medium">Review →</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBgColor="bg-blue-100 dark:bg-blue-950/50"
            label="Total Users"
            value={stats?.totalUsers || 0}
            subtext={`${stats?.totalCustomers || 0} customers • ${stats?.totalInstructors || 0} instructors`}
            isLoading={isLoading}
          />
          <StatCard
            icon={GraduationCap}
            iconColor="text-orange-600 dark:text-orange-400"
            iconBgColor="bg-orange-100 dark:bg-orange-950/50"
            label="Pending Approvals"
            value={pendingCount}
            subtext="instructor applications"
            isLoading={isLoading}
          />
          <StatCard
            icon={ShoppingBag}
            iconColor="text-green-600 dark:text-green-400"
            iconBgColor="bg-green-100 dark:bg-green-950/50"
            label="Total Enrollments"
            value={stats?.totalOrders || 0}
            isLoading={isLoading}
          />
          <StatCard
            icon={List}
            iconColor="text-purple-600 dark:text-purple-400"
            iconBgColor="bg-purple-100 dark:bg-purple-950/50"
            label="Total Categories"
            value={stats?.totalCategories || 0}
            isLoading={isLoading}
          />
        </div>

        {/* ── Charts ── */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Analytics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <EnrollmentTrendChart />
            <RevenueBarChart />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <UserRolePieChart />
            {/* Spacer — pie chart takes 1/3, rest is breathing room */}
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                  {stats?.totalOrders || 0}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Total enrollments across all courses
                </p>
                <p className="text-xs text-zinc-400 mt-3">
                  {stats?.totalInstructors || 0} instructors •{" "}
                  {stats?.totalCategories || 0} categories
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            href="/admin/users"
            icon={UserCog}
            iconColor="text-blue-500"
            iconBgColor="bg-blue-100 dark:bg-blue-950/50"
            hoverBorderColor="hover:border-blue-300 dark:hover:border-blue-700"
            title="Manage Users"
            description="View all users, suspend or activate accounts"
            buttonText="View Users"
          />
          <QuickActionCard
            href="/admin/instructors"
            icon={GraduationCap}
            iconColor="text-orange-500"
            iconBgColor="bg-orange-100 dark:bg-orange-950/50"
            hoverBorderColor="hover:border-orange-300 dark:hover:border-orange-700"
            title="Instructor Applications"
            description={
              pendingCount > 0
                ? `${pendingCount} pending approval${pendingCount !== 1 ? "s" : ""}`
                : "Approve or reject instructor applications"
            }
            buttonText={pendingCount > 0 ? `Review (${pendingCount})` : "View All"}
          />
          <QuickActionCard
            href="/admin/orders"
            icon={Package}
            iconColor="text-green-500"
            iconBgColor="bg-green-100 dark:bg-green-950/50"
            hoverBorderColor="hover:border-green-300 dark:hover:border-green-700"
            title="View Enrollments"
            description="Monitor all enrollments across the platform"
            buttonText="View Enrollments"
          />
          <QuickActionCard
            href="/admin/categories"
            icon={List}
            iconColor="text-purple-500"
            iconBgColor="bg-purple-100 dark:bg-purple-950/50"
            hoverBorderColor="hover:border-purple-300 dark:hover:border-purple-700"
            title="Manage Categories"
            description="Add, edit, or remove course categories"
            buttonText="View Categories"
          />
        </div>
      </div>
    </div>
  );
}