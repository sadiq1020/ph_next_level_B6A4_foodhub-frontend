import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-gray-100">
      <nav className="flex items-center justify-between px-6 md:px-12 py-6">
        <Link href="/" className="text-2xl font-black text-orange-500">
          FOOD<span className="text-white">HUB</span>
        </Link>
        <Link
          href="/"
          className="text-xs uppercase font-bold text-gray-400 border border-white/10 px-5 py-2 rounded-full"
        >
          Back to Home
        </Link>
      </nav>

      {/* Changed justify-center to justify-start and added pt-12 */}
      <main className="flex-grow flex flex-col items-center justify-start pt-12 px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-tighter mb-3">
            Welcome to <span className="text-orange-500">FOOD</span>HUB
          </h1>
          <p className="text-gray-400 font-medium">
            Please enter your details below to continue
          </p>
        </div>

        {/* This is the ONLY container we need. Increase max-w for wider fields */}
        <div className="w-full max-w-[500px] bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
          {children}
        </div>
      </main>
    </div>
  );
}
