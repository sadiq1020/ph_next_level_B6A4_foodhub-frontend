"use client";

import { Card } from "@/components/ui/card";
import { Calendar, GraduationCap, User } from "lucide-react";
import { Order } from "@/types";



interface AdminOrderCardProps {
  order: Order;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300";
    case "ACTIVE":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
    case "COMPLETED":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    case "EXPIRED":
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
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
              {order.customer?.name || "Unknown"} • {order.customer?.email || "N/A"}
            </span>
          </div>

          {/* Note / Access Info */}
          {order.notes && (
            <div className="flex items-center gap-2 text-sm text-zinc-500 italic">
              <span>"{order.notes}"</span>
            </div>
          )}

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
              Courses ({order.items?.length || 0})
            </p>
            <div className="space-y-1">
              {order.items?.slice(0, 3).map((item) => (
                <p
                  key={item.id}
                  className="text-sm text-zinc-600 dark:text-zinc-400"
                >
                  <GraduationCap className="w-3 h-3 inline mr-1" />
                  {item.course?.name || "Unknown Course"}
                </p>
              ))}
              {order.items && order.items.length > 3 && (
                <p className="text-xs text-zinc-400 pl-4">
                  +{order.items.length - 3} more courses
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
