interface OrderSummaryCardProps {
  subtotal: number;
  total: number;
  accessUntil?: string | null;
  // deliveryFee removed
}

export function OrderSummaryCard({
  subtotal,
  total,
  accessUntil,
}: OrderSummaryCardProps) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
        Payment Summary
      </h3>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            ৳{subtotal}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">Platform Fee</span>
          <span className="font-medium text-green-600 dark:text-green-400">
            Free
          </span>
        </div>

        <div className="flex justify-between border-t border-zinc-200 dark:border-zinc-800 pt-2 mt-2">
          <span className="font-bold text-zinc-900 dark:text-zinc-50">
            Total Paid
          </span>
          <span className="font-bold text-xl text-orange-600 dark:text-orange-400">
            ৳{total}
          </span>
        </div>
      </div>

      {/* Access Window */}
      {accessUntil && (
        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-400 flex items-center gap-2">
            <span>🎓</span>
            Access until {formatDate(accessUntil)}
          </p>
        </div>
      )}
    </div>
  );
}