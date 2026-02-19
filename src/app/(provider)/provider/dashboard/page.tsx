"use client";

import { ChefHat, Package, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";

export default function ProviderDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // ✅ Protected route - provider only
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }

    if (!isPending && session?.user) {
      const userRole = (session.user as { role?: string }).role;
      if (userRole !== "PROVIDER") {
        router.push("/");
      }
    }
  }, [session, isPending, router]);

  // Show loading while checking session
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
              <ChefHat className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Welcome back, {user.name}!
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                Manage your menu and orders from here
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add New Meal */}
            <Card className="p-8 border border-zinc-200 dark:border-zinc-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all cursor-pointer group">
              <Link href="/provider/menu" className="block">
                <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Plus className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                  Add New Meal
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  Add a new meal to your menu and start receiving orders
                </p>
                <Button className="w-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-0 text-white">
                  Go to Menu
                </Button>
              </Link>
            </Card>

            {/* View Orders */}
            <Card className="p-8 border border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group">
              <Link href="/provider/orders" className="block">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                  View Orders
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  Check incoming orders and update their status
                </p>
                <Button variant="outline" className="w-full rounded-full">
                  View All Orders
                </Button>
              </Link>
            </Card>

            {/* Manage Menu */}
            <Card className="p-8 border border-zinc-200 dark:border-zinc-800 hover:border-green-300 dark:hover:border-green-700 transition-all cursor-pointer group">
              <Link href="/provider/menu" className="block">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Package className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                  Manage Menu
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  Edit or remove existing meals from your menu
                </p>
                <Button variant="outline" className="w-full rounded-full">
                  Manage Menu
                </Button>
              </Link>
            </Card>

            {/* Profile */}
            <Card className="p-8 border border-zinc-200 dark:border-zinc-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer group">
              <Link href="/profile" className="block">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ChefHat className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                  My Profile
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  Update your business information and contact details
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
