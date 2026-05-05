"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

// ── Types ─────────────────────────────────────────────
type TrendPoint = { date: string; label: string; enrollments: number; revenue: number };
type RevenuePoint = { month: string; revenue: number };
type RolePoint = { role: string; count: number; fill: string };

// ── Chart configs ─────────────────────────────────────
const enrollmentConfig: ChartConfig = {
  enrollments: { label: "Enrollments", color: "hsl(24 100% 55%)" },
};

const revenueConfig: ChartConfig = {
  revenue: { label: "Revenue (৳)", color: "hsl(24 100% 55%)" },
};

const roleConfig: ChartConfig = {
  customers:   { label: "Customers",   color: "hsl(214 100% 60%)" },
  instructors: { label: "Instructors", color: "hsl(24 100% 55%)"  },
  admins:      { label: "Admins",      color: "hsl(270 60% 60%)"  },
};

// ── Skeleton ──────────────────────────────────────────
function ChartSkeleton() {
  return (
    <div className="h-52 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
  );
}

// ── Enrollment trend line chart ───────────────────────
export function EnrollmentTrendChart() {
  const [data, setData] = useState<TrendPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/charts/enrollment-trend")
      .then((res) => setData(res.data || res))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // Show every 5th label to avoid crowding
  const tickFormatter = (_: unknown, index: number) =>
    index % 5 === 0 ? (data[index]?.label ?? "") : "";

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
        Enrollment Trend
      </h3>
      <p className="text-xs text-zinc-400 mb-4">Daily enrollments — last 30 days</p>
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <ChartContainer config={enrollmentConfig} className="h-52 w-full">
          <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              tickFormatter={tickFormatter}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="enrollments"
              stroke="var(--color-enrollments)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      )}
    </div>
  );
}

// ── Revenue bar chart ─────────────────────────────────
export function RevenueBarChart() {
  const [data, setData] = useState<RevenuePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/charts/revenue")
      .then((res) => setData(res.data || res))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
        Monthly Revenue
      </h3>
      <p className="text-xs text-zinc-400 mb-4">Revenue from active/completed enrollments — last 6 months</p>
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <ChartContainer config={revenueConfig} className="h-52 w-full">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
}

// ── User role pie chart ───────────────────────────────
export function UserRolePieChart() {
  const [data, setData] = useState<RolePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/charts/user-roles")
      .then((res) => setData(res.data || res))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
        User Distribution
      </h3>
      <p className="text-xs text-zinc-400 mb-4">Breakdown by role — {total} total users</p>
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <ChartContainer config={roleConfig} className="h-52 w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="role" />} />
            <Pie
              data={data}
              dataKey="count"
              nameKey="role"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="role" />}
            />
          </PieChart>
        </ChartContainer>
      )}
    </div>
  );
}