import { Badge } from "@/components/ui/badge";

type OrderStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "EXPIRED" | "CANCELLED";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING:   "Pending",
  ACTIVE:    "Active",
  COMPLETED: "Completed",
  EXPIRED:   "Expired",
  CANCELLED: "Cancelled",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING:
    "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  ACTIVE:
    "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800",
  COMPLETED:
    "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  EXPIRED:
    "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
  CANCELLED:
    "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge variant="outline" className={STATUS_STYLES[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}