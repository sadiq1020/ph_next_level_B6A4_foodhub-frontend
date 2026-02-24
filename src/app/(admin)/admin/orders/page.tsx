"use client";

import { Package, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AdminOrderCard } from "@/components/admin/AdminOrderCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  meal: {
    id: string;
    name: string;
  };
};

type Order = {
  id: string;
  orderNumber: string;
  status: "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
  total: number;
  deliveryAddress: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
};

type StatusFilter =
  | "ALL"
  | "PLACED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

export default function AdminOrdersPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const hasFetched = useRef(false);

  // Protected route
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

  // Fetch orders — only once per mount, not every time session object re-renders
  useEffect(() => {
    if (!session?.user) return;
    if (hasFetched.current) return;

    const fetchOrders = async () => {
      try {
        hasFetched.current = true;
        setIsLoading(true);
        const data = await api.get("/orders/admin/all");
        setOrders(data.data || data);
        setFilteredOrders(data.data || data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [session?.user?.id]); // ✅ Stable string, not the whole session object

  // Filter and search
  useEffect(() => {
    let result = orders;

    // Filter by status
    if (statusFilter !== "ALL") {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Search by order number
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((order) =>
        order.orderNumber.toLowerCase().includes(query),
      );
    }

    setFilteredOrders(result);
  }, [orders, statusFilter, searchQuery]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className="container mx-auto px-4 py-6">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-full mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-24 w-full" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  const statusCounts = {
    ALL: orders.length,
    PLACED: orders.filter((o) => o.status === "PLACED").length,
    PREPARING: orders.filter((o) => o.status === "PREPARING").length,
    READY: orders.filter((o) => o.status === "READY").length,
    DELIVERED: orders.filter((o) => o.status === "DELIVERED").length,
    CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Orders Overview
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">
            View all orders across the platform
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              placeholder="Search by order number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(
            [
              "ALL",
              "PLACED",
              "PREPARING",
              "READY",
              "DELIVERED",
              "CANCELLED",
            ] as StatusFilter[]
          ).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={`rounded-full whitespace-nowrap ${
                statusFilter === status
                  ? "bg-orange-500 hover:bg-orange-600 text-white border-0"
                  : ""
              }`}
            >
              {status === "ALL" ? "All Orders" : status} ({statusCounts[status]}
              )
            </Button>
          ))}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-24 w-full" />
              </Card>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-zinc-400" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              No orders found
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              {searchQuery
                ? "Try adjusting your search"
                : "No orders match this filter"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <AdminOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
