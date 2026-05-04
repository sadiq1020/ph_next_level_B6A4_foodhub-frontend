"use client";

import { Card } from "@/components/ui/card";
import { OrderStatusSelect } from "./OrderStatusSelect";
import { BookOpen } from "lucide-react";
import { Order } from "@/types";



interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: string) => void;
}

// Status badge colors
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

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  return (
    <Card className="p-6 border border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
        {/* Left: Enrollment Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-orange-500" />
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
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Student: {order.customer?.name || "Unknown"} • {order.customer?.email || "N/A"}
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Enrolled on: {new Date(order.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Right: Status Dropdown */}
        <div className="lg:w-48">
          <OrderStatusSelect
            currentStatus={order.status}
            orderId={order.id}
            onStatusChange={onStatusChange}
          />
        </div>
      </div>

      {/* Items List */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-2">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
          Courses ({order.items?.length || 0})
        </p>
        {order.items?.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-zinc-600 dark:text-zinc-400">
              {item.course.name}
            </span>
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              ৳{item.price}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 mt-4 pt-4 flex justify-between items-center">
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
          Total Earnings
        </span>
        <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
          ৳{order.total}
        </span>
      </div>
    </Card>
  );
}

