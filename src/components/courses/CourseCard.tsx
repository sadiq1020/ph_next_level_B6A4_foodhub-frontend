"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/lib/auth-client";
import type { Course } from "@/types";
import { Clock, GraduationCap, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const getDifficultyColor = (difficulty: string | null | undefined) => {
  if (!difficulty) return "bg-zinc-100 text-zinc-700";
  if (difficulty === "BEGINNER")
    return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
  if (difficulty === "INTERMEDIATE")
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300";
  if (difficulty === "ADVANCED")
    return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
  return "bg-zinc-100 text-zinc-700";
};

const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ""}`.trim() : `${m}m`;
};

export function CourseCard({ course }: { course: Course }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { data: session } = useSession();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!session?.user) {
      toast.error("Please login to enroll in courses", {
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    addToCart(
      {
        courseId: course.id,      // was: mealId
        name: course.name,
        price: Number(course.price),
        image: course.image,
      },
      1,
    );

    toast.success(`${course.name} added to cart!`);
  };

  const isUnavailable = course.isAvailable === false;

  return (
    <Card
      onClick={() => !isUnavailable && router.push(`/courses/${course.id}`)}
      className={`group overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-all duration-300 p-0
        ${
          isUnavailable
            ? "opacity-70 cursor-not-allowed"
            : "cursor-pointer hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg hover:shadow-orange-100 dark:hover:shadow-orange-950/20"
        }`}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-transform duration-300 ${
              !isUnavailable && "group-hover:scale-105"
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-950/50 dark:to-rose-950/50 flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
        )}

        {isUnavailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-red-500 px-3 py-1 rounded-full">
              Unavailable
            </span>
          </div>
        )}

        {/* Difficulty badge */}
        {course.difficulty && (
          <div className="absolute top-2 left-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(course.difficulty)}`}>
              {course.difficulty}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-2">
        <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
          {course.category.name}
        </p>

        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
          {course.name}
        </h3>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">
          🎓 {course.instructor.businessName}
        </p>

        {/* Duration + lessons */}
        {(course.duration || course.lessonsCount) && (
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            {course.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(course.duration)}
              </span>
            )}
            {course.lessonsCount && (
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                {course.lessonsCount} lessons
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
            ৳{course.price}
          </span>

          {isUnavailable ? (
            <span className="text-xs text-red-500 font-medium">Unavailable</span>
          ) : (
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white border-0 gap-1.5 text-xs px-3"
            >
              <ShoppingCart className="w-3 h-3" />
              Enroll
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
