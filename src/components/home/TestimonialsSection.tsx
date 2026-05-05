"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
  };
  course: {
    id: string;
    name: string;
  };
};

function StarRow() {
  return (
    <div className="flex gap-0.5 mb-3">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className="w-4 h-4 fill-amber-400 text-amber-400"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Skeleton for loading state
function ReviewSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 flex flex-col gap-4">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="w-4 h-4 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-full" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-4/5" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-3/5" />
      </div>
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
        <div className="space-y-1">
          <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
          <div className="h-3 w-36 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await api.get("/reviews/top");
        const result: Review[] = data.data || data;
        setReviews(result);
        setHasData(result.length > 0);
      } catch {
        setHasData(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Don't render the section at all if there are no 5-star reviews yet
  if (!isLoading && !hasData) return null;

  return (
    <section className="py-16 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            What Our Students Say
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Real reviews from students who transformed their cooking skills
            with KitchenClass
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {isLoading
            ? [1, 2, 3].map((i) => <ReviewSkeleton key={i} />)
            : reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 flex flex-col hover:border-orange-200 dark:hover:border-orange-800 transition-colors"
                >
                  {/* Stars */}
                  <StarRow />

                  {/* Comment */}
                  <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed flex-1 mb-4">
                    &ldquo;{review.comment}&rdquo;
                  </p>

                  {/* Reviewer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                        {getInitials(review.customer.name)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">
                        {review.customer.name}
                      </p>
                      <p className="text-xs text-zinc-400 truncate max-w-[180px]">
                        on {review.course.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}