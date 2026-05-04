import type { Order } from "@/types";

interface OrderTimelineProps {
  status: Order["status"];
}

export function OrderTimeline({ status }: OrderTimelineProps) {
  const steps = [
    { status: "PENDING",   label: "Enrolled",   icon: "📝" },
    { status: "ACTIVE",    label: "Active",      icon: "🎓" },
    { status: "COMPLETED", label: "Completed",   icon: "🏆" },
  ];

  const statusOrder = ["PENDING", "ACTIVE", "COMPLETED"];
  const currentIndex = statusOrder.indexOf(status);
  const isCancelled = status === "CANCELLED";
  const isExpired   = status === "EXPIRED";

  if (isCancelled) {
    return (
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 text-red-700 dark:text-red-300">
          <span className="text-3xl">❌</span>
          <div>
            <p className="font-semibold">Enrollment Cancelled</p>
            <p className="text-sm text-red-600 dark:text-red-400">
              This enrollment has been cancelled
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6">
        <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
          <span className="text-3xl">⏰</span>
          <div>
            <p className="font-semibold text-zinc-700 dark:text-zinc-300">Enrollment Expired</p>
            <p className="text-sm">
              Your access to this course has expired
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
        Enrollment Status
      </h3>

      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full bg-orange-500 transition-all duration-500"
            style={{
              width: `${(Math.max(currentIndex, 0) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step.status} className="flex flex-col items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                    isCompleted
                      ? "bg-orange-500 text-white scale-110"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                  } ${isCurrent && "ring-4 ring-orange-200 dark:ring-orange-900"}`}
                >
                  {step.icon}
                </div>
                <p
                  className={`text-xs font-medium text-center ${
                    isCompleted
                      ? "text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}