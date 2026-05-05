"use client";

import {
    ChartContainer,
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
    Line,
    LineChart,
    XAxis,
    YAxis,
} from "recharts";

type EnrollmentPoint = { course: string; enrollments: number; revenue: number };
type RevenuePoint = { month: string; revenue: number };

const enrollmentConfig: ChartConfig = {
  enrollments: { label: "Enrollments", color: "hsl(24 100% 55%)" },
};

const revenueConfig: ChartConfig = {
  revenue: { label: "Revenue (৳)", color: "hsl(142 71% 45%)" },
};

function ChartSkeleton() {
  return (
    <div className="h-48 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
  );
}

// ── Enrollments per course bar chart ──────────────────
export function EnrollmentsPerCourseChart({
  data,
  isLoading,
}: {
  data: EnrollmentPoint[];
  isLoading: boolean;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
        Enrollments per Course
      </h3>
      <p className="text-xs text-zinc-400 mb-4">
        Total students enrolled in each of your courses
      </p>
      {isLoading ? (
        <ChartSkeleton />
      ) : data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-sm text-zinc-400">
          No courses yet
        </div>
      ) : (
        <ChartContainer config={enrollmentConfig} className="h-48 w-full">
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-border"
            />
            <XAxis
              dataKey="course"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={40}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              allowDecimals={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="enrollments"
              fill="var(--color-enrollments)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
}

// ── Revenue over time line chart ──────────────────────
export function InstructorRevenueChart({
  data,
  isLoading,
}: {
  data: RevenuePoint[];
  isLoading: boolean;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
        Revenue Over Time
      </h3>
      <p className="text-xs text-zinc-400 mb-4">
        Monthly earnings from active/completed enrollments — last 6 months
      </p>
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <ChartContainer config={revenueConfig} className="h-48 w-full">
          <LineChart
            data={data}
            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-border"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      )}
    </div>
  );
}

// ── Combined hook — fetches both in one call ──────────
export function useInstructorCharts() {
  const [enrollmentsPerCourse, setEnrollmentsPerCourse] = useState<EnrollmentPoint[]>([]);
  const [revenueOverTime, setRevenueOverTime] = useState<RevenuePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get("/instructor/charts")
      .then((res) => {
        const d = res.data || res;
        setEnrollmentsPerCourse(d.enrollmentsPerCourse || []);
        setRevenueOverTime(d.revenueOverTime || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return { enrollmentsPerCourse, revenueOverTime, isLoading };
}