"use client";

import { OrderCard } from "@/components/orders/OrderCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { Order } from "@/types";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CACHE_KEY = (userId: string) => `foodhub_orders_${userId}`;

function getCached(userId: string): Order[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY(userId));
    return raw ? (JSON.parse(raw) as Order[]) : null;
  } catch {
    return null;
  }
}

function setCached(userId: string, data: Order[]) {
  try {
    sessionStorage.setItem(CACHE_KEY(userId), JSON.stringify(data));
  } catch {
    // ignore
  }
}

//  Loading skeleton
function OrdersListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5"
        >
          <div className="flex justify-between mb-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //  Protected route
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!session?.user) return;

    const userId = session.user.id;

    // ✅ Read cache and fetch in one effect, batch all state updates together
    // to satisfy the linter (no cascading setState calls).
    const run = async () => {
      const cached = getCached(userId);

      // Batch: if we have cached data, show it and mark loaded in one update
      if (cached) {
        setOrders(cached);
        setIsLoading(false);
      }

      // Always fetch fresh data in the background
      try {
        const data = await api.get("/orders");
        const fresh: Order[] = data.data || data;
        setCached(userId, fresh);
        // Single setState call — no cascade
        setOrders(fresh);
        if (!cached) setIsLoading(false); // only needed if no cache was present
      } catch (error) {
        // console.error("Failed to fetch orders:", error);
        if (!cached) setIsLoading(false);
      }
    };

    run();
  }, [session?.user?.id]); // ✅ Stable string — only re-runs on actual user change

  // Show spinner only while auth session is being checked
  if (isPending) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Page Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            My Orders
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            {isLoading
              ? "Loading orders..."
              : `${orders.length} order${orders.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Loading State — only shown on very first visit (no cache yet) */}
        {isLoading && <OrdersListSkeleton />}

        {/* Empty State */}
        {!isLoading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              No orders yet
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm">
              Looks like you haven&apos;t placed any orders yet. Browse our
              meals to get started!
            </p>
            <Button
              asChild
              className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-0 text-white px-8"
            >
              <Link href="/meals">Browse Meals</Link>
            </Button>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && orders.length > 0 && (
          <div className="space-y-4 max-w-3xl mx-auto">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
