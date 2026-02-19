"use client";

import {
  List,
  Package,
  Settings,
  ShoppingBag,
  UserCog,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

type AdminStats = {
  totalUsers: number;
  totalCustomers: number;
  totalProviders: number;
  totalOrders: number;
  totalCategories: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Protected route - admin only
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }

    if (!isPending && session?.user) {
      const userRole = (session.user as { role?: string }).role;
      if (userRole !== "ADMIN") {
        router.push("/");
      }
    }
  }, [session, isPending, router]);

  // ✅ Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user) return;

      try {
        setIsLoading(true);
        const data = await api.get("/admin/stats");
        setStats(data.data || data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchStats();
    }
  }, [session]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) return null;

  const user = session.user as { name: string; role?: string };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Page Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
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
        {/* Stats Grid - 3 cards instead of 4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Users */}
          <Card className="p-6 border border-zinc-200 dark:border-zinc-800">
            {isLoading ? (
              <>
                <Skeleton className="h-10 w-10 rounded-full mb-4" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                  {stats?.totalUsers || 0}
                </p>
                <p className="text-xs text-zinc-400 mt-2">
                  {stats?.totalCustomers || 0} customers •{" "}
                  {stats?.totalProviders || 0} providers
                </p>
              </>
            )}
          </Card>

          {/* Total Orders */}
          <Card className="p-6 border border-zinc-200 dark:border-zinc-800">
            {isLoading ? (
              <>
                <Skeleton className="h-10 w-10 rounded-full mb-4" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                  {stats?.totalOrders || 0}
                </p>
              </>
            )}
          </Card>

          {/* Total Categories */}
          <Card className="p-6 border border-zinc-200 dark:border-zinc-800">
            {isLoading ? (
              <>
                <Skeleton className="h-10 w-10 rounded-full mb-4" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center mb-4">
                  <List className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                  Total Categories
                </p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                  {stats?.totalCategories || 0}
                </p>
              </>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Manage Users */}
          <Card className="p-8 border border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group">
            <Link href="/admin/users" className="block">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UserCog className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                Manage Users
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                View and manage all users, suspend or activate accounts
              </p>
              <Button variant="outline" className="w-full rounded-full">
                View Users
              </Button>
            </Link>
          </Card>

          {/* View Orders */}
          <Card className="p-8 border border-zinc-200 dark:border-zinc-800 hover:border-green-300 dark:hover:border-green-700 transition-all cursor-pointer group">
            <Link href="/admin/orders" className="block">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Package className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                View Orders
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                Monitor all orders across the platform
              </p>
              <Button variant="outline" className="w-full rounded-full">
                View Orders
              </Button>
            </Link>
          </Card>

          {/* Manage Categories */}
          <Card className="p-8 border border-zinc-200 dark:border-zinc-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer group">
            <Link href="/admin/categories" className="block">
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <List className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                Manage Categories
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                Add, edit, or remove meal categories
              </p>
              <Button variant="outline" className="w-full rounded-full">
                View Categories
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
