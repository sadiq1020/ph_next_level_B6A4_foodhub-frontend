"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = (user as { role?: string })?.role;

  // Determine the right CTA based on login state and role
  const primaryHref =
    role === "INSTRUCTOR"
      ? "/instructor/dashboard"
      : role === "ADMIN"
        ? "/admin/dashboard"
        : "/courses";

  const primaryLabel =
    role === "INSTRUCTOR"
      ? "Go to Dashboard"
      : role === "ADMIN"
        ? "Admin Panel"
        : "Browse Courses";

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-rose-50 dark:from-orange-950 dark:via-zinc-900 dark:to-rose-950 relative overflow-hidden border-y border-orange-100 dark:border-none">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.2] dark:opacity-10 sepia-[0.3] saturate-[2] hue-rotate-[-10deg] dark:sepia-0 dark:saturate-100 dark:hue-rotate-0">
        <div className="absolute top-8 left-12 text-8xl select-none pointer-events-none">
          🍳
        </div>
        <div className="absolute top-12 right-20 text-6xl select-none pointer-events-none">
          👨‍🍳
        </div>
        <div className="absolute bottom-8 left-1/4 text-7xl select-none pointer-events-none">
          🎂
        </div>
        <div className="absolute bottom-12 right-1/3 text-5xl select-none pointer-events-none">
          🍜
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-white/20 flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-8 h-8 text-orange-600 dark:text-white" />
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4 leading-tight">
            Ready to Start Cooking Like a Pro?
          </h2>

          {/* Subtext */}
          <p className="text-zinc-600 dark:text-orange-100 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
            Join thousands of students who are mastering new culinary skills
            every day. From your first knife cut to plating like a Michelin
            chef — it starts here.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-orange-600 text-white hover:bg-orange-700 dark:bg-white dark:text-orange-600 dark:hover:bg-orange-50 border-0 px-8 h-12 font-semibold gap-2 shadow-lg"
            >
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            {/* Only show "Become an Instructor" to logged-out users or customers */}
            {(!user || role === "CUSTOMER") && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-zinc-200 text-zinc-900 hover:bg-zinc-50 dark:border-white/60 dark:text-white dark:hover:bg-white/10 dark:hover:border-white px-8 h-12 font-semibold gap-2 bg-white dark:bg-transparent"
              >
                <Link href="/register">Become an Instructor</Link>
              </Button>
            )}
          </div>

          {/* Trust line */}
          <p className="text-zinc-400 dark:text-orange-100/70 text-sm mt-8 flex items-center justify-center gap-2">
            <span className="text-orange-500">✓</span>
            <span>No subscription required</span>
            <span className="mx-2 opacity-40">•</span>
            <span className="text-orange-500">✓</span>
            <span>Lifetime access per course</span>
            <span className="mx-2 opacity-40">•</span>
            <span className="text-orange-500">✓</span>
            <span>Learn at your own pace</span>
          </p>
        </div>
      </div>
    </section>
  );
}