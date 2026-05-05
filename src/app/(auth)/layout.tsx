import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-rose-50 dark:from-orange-950 dark:via-zinc-900 dark:to-rose-950 text-zinc-900 dark:text-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.4] dark:opacity-20 sepia-[0.3] saturate-[2] hue-rotate-[-10deg] dark:sepia-0 dark:saturate-100 dark:hue-rotate-0 pointer-events-none">
        <div className="absolute top-12 left-10 text-8xl select-none">🍳</div>
        <div className="absolute top-1/4 right-10 text-6xl select-none">👨‍🍳</div>
        <div className="absolute bottom-1/4 left-20 text-7xl select-none">🎂</div>
        <div className="absolute bottom-12 right-20 text-5xl select-none">🍜</div>
      </div>

      <nav className="flex items-center justify-between px-6 md:px-12 py-6 relative z-10">
        <Link href="/" className="text-2xl font-black text-orange-600 dark:text-orange-500">
          KITCHEN<span className="text-zinc-900 dark:text-white">CLASS</span>
        </Link>
        <Link
          href="/"
          className="text-xs uppercase font-bold text-zinc-500 dark:text-gray-400 border border-zinc-200 dark:border-white/10 px-5 py-2 rounded-full hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
        >
          Back to Home
        </Link>
      </nav>

      {/* Changed justify-center to justify-start and added pt-12 */}
      <main className="flex-grow flex flex-col items-center justify-start pt-0 md:pt-2 px-6 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-900 dark:text-white uppercase tracking-tighter mb-3">
            Welcome to <span className="text-orange-600 dark:text-orange-500">KITCHEN</span>CLASS
          </h1>
          <p className="text-zinc-500 dark:text-orange-100/70 font-medium">
            Please enter your details below to continue
          </p>
        </div>

        {/* This is the ONLY container we need. Increase max-w for wider fields */}
        <div className="w-full max-w-[500px] bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white dark:border-white/10 shadow-xl dark:shadow-2xl">
          {children}
        </div>
      </main>
    </div>
  );
}
