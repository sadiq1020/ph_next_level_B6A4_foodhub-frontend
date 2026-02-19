import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  label: string;
  value: number;
  subtext?: string;
  isLoading: boolean;
}

export function StatCard({
  icon: Icon,
  iconColor,
  iconBgColor,
  label,
  value,
  subtext,
  isLoading,
}: StatCardProps) {
  return (
    <Card className="p-6 border border-zinc-200 dark:border-zinc-800">
      {isLoading ? (
        <>
          <Skeleton className="h-10 w-10 rounded-full mb-4" />
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
        </>
      ) : (
        <>
          <div
            className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center mb-4`}
          >
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
            {label}
          </p>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {value}
          </p>
          {subtext && <p className="text-xs text-zinc-400 mt-2">{subtext}</p>}
        </>
      )}
    </Card>
  );
}
