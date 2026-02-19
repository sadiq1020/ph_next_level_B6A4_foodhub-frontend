"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrderStatus = "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";

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
    currentStatus === "DELIVERED" || currentStatus === "CANCELLED";

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
        <SelectItem value="PLACED">Placed</SelectItem>
        <SelectItem value="PREPARING">Preparing</SelectItem>
        <SelectItem value="READY">Ready</SelectItem>
        <SelectItem value="DELIVERED">Delivered</SelectItem>
      </SelectContent>
    </Select>
  );
}
