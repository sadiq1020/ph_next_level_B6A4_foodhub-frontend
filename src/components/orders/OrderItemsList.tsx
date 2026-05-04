"use client";

import { Button } from "@/components/ui/button";
import { Clock, Star } from "lucide-react";
import Image from "next/image";
import { EnrollmentItem } from "@/types";



interface OrderItemsListProps {
  items: EnrollmentItem[];
  canReview?: boolean;
  onReviewClick?: (courseId: string, courseName: string) => void;
}

export function OrderItemsList({
  items,
  canReview = false,
  onReviewClick,
}: OrderItemsListProps) {
  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ""}`.trim() : `${m}m`;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
        Enrolled Courses
      </h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800"
          >
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
              {item.course.image ? (
                <Image
                  src={item.course.image}
                  alt={item.course.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  🎬
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                {item.course.name}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                {item.course.difficulty && (
                  <span className="text-xs text-zinc-400 capitalize">
                    {item.course.difficulty.toLowerCase()}
                  </span>
                )}
                {item.course.duration && (
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(item.course.duration)}
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                ৳{item.price}
              </p>
            </div>

            {/* Review Button */}
            {canReview && onReviewClick && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReviewClick(item.course.id, item.course.name)}
                className="gap-2 shrink-0"
              >
                <Star className="w-4 h-4" />
                Review
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}