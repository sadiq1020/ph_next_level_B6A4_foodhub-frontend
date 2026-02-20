"use client";

import { Card } from "@/components/ui/card";
import { Calendar, MapPin, User } from "lucide-react";

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

interface AdminOrderCardProps {
  order: Order;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "PLACED":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
    case "PREPARING":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300";
    case "READY":
      return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300";
    case "DELIVERED":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    case "CANCELLED":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
};

export function AdminOrderCard({ order }: AdminOrderCardProps) {
  return (
    <Card className="p-6 border border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Left: Order Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">
              #{order.orderNumber}
            </h3>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusStyle(
                order.status,
              )}`}
            >
              {order.status}
            </span>
          </div>

          {/* Customer */}
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <User className="w-4 h-4 shrink-0" />
            <span>
              {order.customer.name} • {order.customer.email}
            </span>
          </div>

          {/* Delivery Address */}
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="line-clamp-1">{order.deliveryAddress}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>
              {new Date(order.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Items */}
          <div className="pt-2">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
              Items ({order.items.length})
            </p>
            <div className="space-y-1">
              {order.items.slice(0, 3).map((item) => (
                <p
                  key={item.id}
                  className="text-sm text-zinc-600 dark:text-zinc-400"
                >
                  {item.quantity}x {item.meal.name}
                </p>
              ))}
              {order.items.length > 3 && (
                <p className="text-xs text-zinc-400">
                  +{order.items.length - 3} more items
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Total */}
        <div className="text-right">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Total</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            ৳{order.total}
          </p>
        </div>
      </div>
    </Card>
  );
}
