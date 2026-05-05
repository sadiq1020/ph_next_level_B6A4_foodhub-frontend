"use client";

import { useEffect, useRef, useState } from "react";

const FEATURES = [
  {
    icon: "👨‍🍳",
    title: "Expert Instructors",
    description:
      "Learn from professional chefs with years of real kitchen experience. Every instructor is vetted and approved by our team before publishing.",
    highlight: "50+ verified instructors",
    color: "bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900",
    iconBg: "bg-orange-100 dark:bg-orange-950/50",
  },
  {
    icon: "🎬",
    title: "Learn at Your Own Pace",
    description:
      "Access your courses anytime, anywhere. No deadlines, no pressure. Rewatch lessons as many times as you need until the technique clicks.",
    highlight: "1 year access per enrollment",
    color: "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900",
    iconBg: "bg-blue-100 dark:bg-blue-950/50",
  },
  {
    icon: "📊",
    title: "All Skill Levels Welcome",
    description:
      "From your very first omelette to advanced pastry techniques. Courses are tagged Beginner, Intermediate, or Advanced so you always start at the right level.",
    highlight: "Beginner to Advanced",
    color: "bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-900",
    iconBg: "bg-green-100 dark:bg-green-950/50",
  },
  {
    icon: "⭐",
    title: "Trusted Reviews",
    description:
      "Every review comes from a verified enrolled student. No fake ratings — just honest feedback to help you choose the right course with confidence.",
    highlight: "Verified student reviews only",
    color: "bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900",
    iconBg: "bg-purple-100 dark:bg-purple-950/50",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 100);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className={`rounded-2xl border p-6 flex flex-col transition-all duration-500 ${feature.color} ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6"
      }`}
    >
      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-5 text-2xl`}
      >
        {feature.icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
        {feature.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1 mb-4">
        {feature.description}
      </p>

      {/* Highlight pill */}
      <div className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
        {feature.highlight}
      </div>
    </div>
  );
}

export function WhyKitchenClass() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-12 transition-all duration-600"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(-16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            Why KitchenClass?
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            We built KitchenClass for people who are serious about improving
            their cooking — not just watching videos
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}