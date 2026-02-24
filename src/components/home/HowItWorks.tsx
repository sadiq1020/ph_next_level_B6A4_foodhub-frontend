"use client";

import {
  MapPin,
  ShoppingBag,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    icon: ShoppingBag,
    title: "Browse Meals",
    description:
      "Explore hundreds of delicious meals from the best local restaurants and home cooks in your area.",
  },
  {
    number: "02",
    icon: ShoppingCart,
    title: "Add to Cart & Checkout",
    description:
      "Select your favorite meals, add them to your cart, and complete your order in just a few clicks.",
  },
  {
    number: "03",
    icon: MapPin,
    title: "Track Your Order",
    description:
      "Follow your order in real-time from the kitchen to your doorstep. Always know where your food is.",
  },
  {
    number: "04",
    icon: UtensilsCrossed,
    title: "Enjoy Delicious Food!",
    description:
      "Sit back, relax, and enjoy fresh, hot meals delivered right to your door. Bon appétit!",
  },
];

// Each step card animates in when it enters the viewport
function AnimatedStep({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[0];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const Icon = step.icon;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger: each card waits a bit longer than the previous one
          setTimeout(() => setVisible(true), index * 150);
          observer.disconnect(); // animate once only
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
      className="relative flex flex-col items-center text-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(32px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      {/* Connector line between steps */}
      {!isLast && (
        <div
          className="hidden lg:block absolute top-10 left-[60%] w-full h-px z-0"
          style={{
            background: "linear-gradient(to right, #fed7aa, #ffedd5)",
          }}
        />
      )}

      {/* Icon Circle */}
      <div className="relative z-10 w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-950/50 border-2 border-orange-200 dark:border-orange-800 flex items-center justify-center mb-4 transition-all duration-300 hover:border-orange-400 hover:scale-110 hover:shadow-lg hover:shadow-orange-100 dark:hover:shadow-orange-950/50 cursor-default">
        <Icon className="w-8 h-8 text-orange-500 dark:text-orange-400" />

        {/* Step Number Badge — pops in with a spring bounce after the card appears */}
        <span
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0)",
            transition: `opacity 0.4s ease ${index * 150 + 300}ms, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 150 + 300}ms`,
          }}
        >
          {index + 1}
        </span>
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
        {step.title}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
        {step.description}
      </p>
    </div>
  );
}

export function HowItWorks() {
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
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header — fades in downward on scroll */}
        <div
          ref={headerRef}
          className="text-center mb-12"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0px)" : "translateY(-20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            How It Works
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Order your favorite food in 4 simple steps
          </p>
        </div>

        {/* Steps Grid — each card animates in with staggered delay */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <AnimatedStep
              key={step.number}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
