import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">🍽️</span>
        </div>

        {/* 404 Text */}
        <h1 className="text-6xl font-bold text-orange-500 mb-4">404</h1>

        {/* Title */}
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/meals">Browse Meals</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-orange-500 hover:bg-orange-600"
          >
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
