"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/meals?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/meals");
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 dark:from-orange-950/30 dark:via-zinc-900 dark:to-rose-950/20" />

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300/20 dark:bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-300/20 dark:bg-rose-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-200/10 dark:bg-amber-500/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          Fresh meals delivered daily
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-zinc-50">
          Discover & Order{" "}
          <span className="relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
              Delicious Meals
            </span>
            {/* Underline decoration */}
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 300 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 8 Q75 2 150 8 Q225 14 298 8"
                stroke="url(#paint0_linear)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="0"
                  y1="0"
                  x2="300"
                  y2="0"
                >
                  <stop stopColor="#f97316" />
                  <stop offset="1" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Connect with the best local food providers in your area. Browse
          hundreds of fresh, homemade meals and get them delivered right to your
          door.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 max-w-lg mx-auto mb-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full px-4 py-2 shadow-lg shadow-zinc-100 dark:shadow-none"
        >
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <Input
            type="text"
            placeholder="Search for biriyani, pizza, salad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 bg-transparent shadow-none focus-visible:ring-0 placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100 flex-1"
          />
          <Button
            type="submit"
            size="sm"
            className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-0 text-white px-5"
          >
            Search
          </Button>
        </form>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-0 text-white px-8 shadow-lg shadow-orange-200 dark:shadow-orange-950"
          >
            <Link href="/meals" className="flex items-center gap-2">
              Browse Meals
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full px-8 border-zinc-300 dark:border-zinc-700"
          >
            <Link href="/providers">View Providers</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-14">
          {[
            { value: "500+", label: "Meals Available" },
            { value: "50+", label: "Local Providers" },
            { value: "10k+", label: "Happy Customers" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {stat.value}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 80 L0 40 Q360 0 720 40 Q1080 80 1440 40 L1440 80 Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
