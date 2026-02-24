"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Floating food emojis that drift around the background
const FOOD_EMOJIS = ["🍕", "🍜", "🍱", "🌮", "🍔", "🥗", "🍣", "🍛"];

function FloatingEmoji({
  emoji,
  style,
}: {
  emoji: string;
  style: React.CSSProperties;
}) {
  return (
    <span
      className="absolute select-none pointer-events-none text-2xl opacity-20 dark:opacity-10"
      style={style}
    >
      {emoji}
    </span>
  );
}

// Inline keyframes injected once into the document
const KEYFRAMES = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-18px) rotate(6deg); }
  66%       { transform: translateY(8px) rotate(-4deg); }
}
@keyframes drawLine {
  from { stroke-dashoffset: 320; }
  to   { stroke-dashoffset: 0; }
}
@keyframes blobDrift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(30px, -20px) scale(1.08); }
}
@keyframes popIn {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1); }
}
`;

// Staggered fade-up style helper
function fadeUp(delayMs: number): React.CSSProperties {
  return {
    opacity: 0,
    animation: `fadeUp 0.7s ease forwards`,
    animationDelay: `${delayMs}ms`,
  };
}

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Inject keyframes once
  useEffect(() => {
    if (document.getElementById("hero-keyframes")) return;
    const style = document.createElement("style");
    style.id = "hero-keyframes";
    style.textContent = KEYFRAMES;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/meals?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/meals");
    }
  };

  // Fixed positions for floating emojis so they don't shift on hydration
  const floatingEmojis = [
    {
      emoji: "🍕",
      style: {
        top: "12%",
        left: "8%",
        animation: "float 6s ease-in-out infinite",
        animationDelay: "0s",
      },
    },
    {
      emoji: "🍜",
      style: {
        top: "20%",
        right: "9%",
        animation: "float 7s ease-in-out infinite",
        animationDelay: "1s",
      },
    },
    {
      emoji: "🍱",
      style: {
        top: "55%",
        left: "4%",
        animation: "float 8s ease-in-out infinite",
        animationDelay: "2s",
      },
    },
    {
      emoji: "🌮",
      style: {
        top: "70%",
        right: "6%",
        animation: "float 6.5s ease-in-out infinite",
        animationDelay: "0.5s",
      },
    },
    {
      emoji: "🍔",
      style: {
        top: "35%",
        left: "14%",
        animation: "float 9s ease-in-out infinite",
        animationDelay: "1.5s",
      },
    },
    {
      emoji: "🥗",
      style: {
        top: "40%",
        right: "12%",
        animation: "float 7.5s ease-in-out infinite",
        animationDelay: "3s",
      },
    },
    {
      emoji: "🍣",
      style: {
        bottom: "18%",
        left: "10%",
        animation: "float 8.5s ease-in-out infinite",
        animationDelay: "2.5s",
      },
    },
    {
      emoji: "🍛",
      style: {
        bottom: "22%",
        right: "8%",
        animation: "float 6s ease-in-out infinite",
        animationDelay: "4s",
      },
    },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 dark:from-orange-950/30 dark:via-zinc-900 dark:to-rose-950/20" />

      {/* Animated background blobs */}
      <div
        className="absolute top-20 left-10 w-72 h-72 bg-orange-300/20 dark:bg-orange-500/10 rounded-full blur-3xl"
        style={{ animation: "blobDrift 8s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-rose-300/20 dark:bg-rose-500/10 rounded-full blur-3xl"
        style={{ animation: "blobDrift 10s ease-in-out infinite reverse" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-200/10 dark:bg-amber-500/5 rounded-full blur-3xl" />

      {/* Floating food emojis */}
      {floatingEmojis.map((item, i) => (
        <FloatingEmoji key={i} emoji={item.emoji} style={item.style} />
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Badge — fades down from above */}
        <div
          style={{
            opacity: 0,
            animation: "fadeDown 0.6s ease forwards",
            animationDelay: "100ms",
            display: "inline-flex",
          }}
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            Fresh meals delivered daily
          </div>
        </div>

        {/* Headline — fades up */}
        <div style={fadeUp(250)}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-zinc-50">
            Discover & Order{" "}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
                Delicious Meals
              </span>
              {/* Underline draws itself in */}
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
                  strokeDasharray="320"
                  strokeDashoffset="320"
                  style={{
                    animation: "drawLine 1s ease forwards",
                    animationDelay: "800ms",
                  }}
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
        </div>

        {/* Subheadline — fades up */}
        <div style={fadeUp(450)}>
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with the best local food providers in your area. Browse
            hundreds of fresh, homemade meals and get them delivered right to
            your door.
          </p>
        </div>

        {/* Search Bar — fades up */}
        <div style={fadeUp(600)}>
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
        </div>

        {/* CTA Buttons — fades up */}
        <div style={fadeUp(750)}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-0 text-white px-8 shadow-lg shadow-orange-200 dark:shadow-orange-950 transition-transform duration-200 hover:scale-105"
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
              className="rounded-full px-8 border-zinc-300 dark:border-zinc-700 transition-transform duration-200 hover:scale-105"
            >
              <Link href="/providers">View Providers</Link>
            </Button>
          </div>
        </div>

        {/* Stats — pop in one by one */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-14">
          {[
            { value: "500+", label: "Meals Available" },
            { value: "50+", label: "Local Providers" },
            { value: "10k+", label: "Happy Customers" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="text-center"
              style={{
                opacity: 0,
                animation: "popIn 0.5s ease forwards",
                animationDelay: `${950 + i * 120}ms`,
              }}
            >
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

      {/* Bottom wave */}
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
