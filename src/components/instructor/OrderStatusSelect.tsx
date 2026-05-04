"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrderStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "EXPIRED" | "CANCELLED";

interface OrderStatusSelectProps {
  currentStatus: OrderStatus;
  orderId: string;
  onStatusChange: (orderId: string, newStatus: string) => void;
}

export function OrderStatusSelect({
  currentStatus,
  orderId,
  onStatusChange,
}: OrderStatusSelectProps) {
  const isDisabled =
    currentStatus === "COMPLETED" || 
    currentStatus === "CANCELLED" || 
    currentStatus === "EXPIRED";

  return (
    <Select
      value={currentStatus}
      onValueChange={(value) => onStatusChange(orderId, value)}
      disabled={isDisabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PENDING">Pending</SelectItem>
        <SelectItem value="ACTIVE">Active</SelectItem>
        <SelectItem value="COMPLETED">Completed</SelectItem>
        <SelectItem value="EXPIRED">Expired</SelectItem>
        <SelectItem value="CANCELLED">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
}
