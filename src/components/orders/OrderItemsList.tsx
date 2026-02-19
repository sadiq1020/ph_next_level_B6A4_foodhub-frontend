import type { OrderItem } from "@/types";
import Image from "next/image";

interface OrderItemsListProps {
  items: OrderItem[];
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
        Order Items
      </h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50"
          >
            {/* Image */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
              {item.meal.image ? (
                <Image
                  src={item.meal.image}
                  alt={item.meal.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl">
                  🍽️
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-zinc-900 dark:text-zinc-50 truncate">
                {item.meal.name}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {item.quantity} × ৳{item.price}
              </p>
            </div>

            {/* Subtotal */}
            <p className="font-semibold text-zinc-900 dark:text-zinc-50">
              ৳{item.quantity * item.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
