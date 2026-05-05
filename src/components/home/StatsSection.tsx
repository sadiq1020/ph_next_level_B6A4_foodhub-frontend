"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  value: number;
  suffix: string;
  label: string;
  description: string;
  icon: string;
};

const STATS: Stat[] = [
  {
    value: 200,
    suffix: "+",
    label: "Courses Available",
    description: "From beginner baking to advanced techniques",
    icon: "🎬",
  },
  {
    value: 50,
    suffix: "+",
    label: "Expert Instructors",
    description: "Professional chefs and culinary specialists",
    icon: "👨‍🍳",
  },
  {
    value: 10000,
    suffix: "+",
    label: "Students Enrolled",
    description: "Home cooks learning new skills every day",
    icon: "🎓",
  },
  {
    value: 4.8,
    suffix: "★",
    label: "Average Rating",
    description: "Based on thousands of student reviews",
    icon: "⭐",
  },
];

// ── Animated counter hook ─────────────────────────────
function useCountUp(target: number, duration = 1800, started: boolean) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!started) return;

    const isDecimal = target % 1 !== 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      setCurrent(isDecimal ? Math.round(value * 10) / 10 : Math.floor(value));
      if (progress < 1) requestAnimationFrame(tick);
      else setCurrent(target);
    };

    requestAnimationFrame(tick);
  }, [target, duration, started]);

  return current;
}

// ── Single stat card ──────────────────────────────────
function StatCard({ stat, started }: { stat: Stat; started: boolean }) {
  const count = useCountUp(stat.value, 1800, started);
  const isDecimal = stat.value % 1 !== 0;
  const display = isDecimal ? count.toFixed(1) : count.toLocaleString();

  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-orange-800 transition-colors">
      <span className="text-4xl mb-4">{stat.icon}</span>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          {display}
        </span>
        <span className="text-2xl font-bold text-orange-500">
          {stat.suffix}
        </span>
      </div>
      <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
        {stat.label}
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
        {stat.description}
      </p>
    </div>
  );
}

// ── Section ───────────────────────────────────────────
export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  // Start counting when section scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-white dark:from-orange-950/20 dark:to-zinc-950">
      <div className="container mx-auto px-4" ref={ref}>
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            KitchenClass by the Numbers
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Join thousands of passionate home cooks who are mastering the
            culinary arts with our expert-led courses
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} started={started} />
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-400 dark:text-zinc-500">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            New courses added weekly
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
            Lifetime access after enrollment
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            Learn at your own pace
          </span>
        </div>
      </div>
    </section>
  );
}