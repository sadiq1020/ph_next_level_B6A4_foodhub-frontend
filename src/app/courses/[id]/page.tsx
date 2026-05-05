import { AddToCart } from "@/components/courses/AddToCart";
import { Button } from "@/components/ui/button";
import { Course } from "@/types";
import { ArrowLeft, Clock, GraduationCap, LayoutList, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// ── Fetch ─────────────────────────────────────────────
async function getCourse(id: string): Promise<Course | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`, {
      cache: "no-store", // always fresh — reviews must appear immediately
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || data;
  } catch {
    return null;
  }
}

// ── Helpers ───────────────────────────────────────────
const getDifficultyStyle = (difficulty: string) => {
  if (difficulty === "BEGINNER")
    return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
  if (difficulty === "INTERMEDIATE")
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300";
  if (difficulty === "ADVANCED")
    return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
  return "bg-zinc-100 text-zinc-600";
};

const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ""}`.trim() : `${m}m`;
};

// ── Extract YouTube embed URL from any YouTube link ──
function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);

    // Handle: youtube.com/watch?v=VIDEO_ID
    if (parsed.hostname.includes("youtube.com") && parsed.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
    }

    // Handle: youtu.be/VIDEO_ID
    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }

    // Handle: youtube.com/embed/VIDEO_ID (already an embed URL)
    if (parsed.hostname.includes("youtube.com") && parsed.pathname.startsWith("/embed/")) {
      return url;
    }

    return null;
  } catch {
    return null;
  }
}

// ── Star renderer ─────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────
export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) notFound();

  const reviews = course.reviews || [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Back Button */}
        <Button
          asChild
          variant="ghost"
          className="mb-6 gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 -ml-2"
        >
          <Link href="/courses">
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </Button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

          {/* ── Left: Image ── */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            {course.image ? (
              <Image
                src={course.image}
                alt={course.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl">🎬</span>
              </div>
            )}

            {!course.isAvailable && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-semibold bg-red-500 px-4 py-2 rounded-full">
                  Currently Unavailable
                </span>
              </div>
            )}
          </div>

          {/* ── Right: Details ── */}
          <div className="flex flex-col gap-5">

            {/* Category */}
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
              {course.category.name}
            </p>

            {/* Name */}
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
              {course.name}
            </h1>

            {/* Course meta row */}
            <div className="flex flex-wrap gap-2">
              {course.difficulty && (
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${getDifficultyStyle(course.difficulty)}`}>
                  {course.difficulty}
                </span>
              )}
              {course.duration && (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(course.duration)}
                </span>
              )}
              {course.lessonsCount && (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center gap-1">
                  <LayoutList className="w-3 h-3" />
                  {course.lessonsCount} lessons
                </span>
              )}
            </div>

            {/* Rating */}
            {course.averageRating ? (
              <div className="flex items-center gap-2">
                <StarRating rating={course.averageRating} />
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  {course.averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-zinc-400">
                  ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            ) : (
              <p className="text-sm text-zinc-400">No reviews yet</p>
            )}

            {/* Description */}
            {course.description && (
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                {course.description}
              </p>
            )}

            {/* Instructor */}
            <Link
              href={`/instructor-profiles/${course.instructor.id}`}
              className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-orange-300 dark:hover:border-orange-700 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900 dark:text-zinc-50 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors text-sm">
                  {course.instructor.businessName}
                </p>
                {course.instructor.address && (
                  <p className="text-xs text-zinc-400 truncate">
                    {course.instructor.address}
                  </p>
                )}
              </div>
              <ArrowLeft className="w-4 h-4 text-zinc-400 rotate-180 shrink-0" />
            </Link>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                ৳{course.price}
              </span>
              <span className="text-zinc-400 text-sm">enrollment fee</span>
            </div>

            {/* What you get */}
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/30 px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-800">
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>1 year access after enrollment</span>
            </div>

            {/* Add to Cart — Client Component */}
            <AddToCart
              course={{
                id: course.id,
                name: course.name,
                price: Number(course.price),
                isAvailable: course.isAvailable,
                image: course.image,
              }}
            />
          </div>
        </div>

        {/* ── Preview Video ── */}
{course.videoUrl && getYouTubeEmbedUrl(course.videoUrl) && (
  <div className="mb-12">
    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
      Course Preview
    </h2>
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-zinc-900">
      <iframe
        src={`${getYouTubeEmbedUrl(course.videoUrl)}?rel=0&modestbranding=1`}
        title={`${course.name} preview`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  </div>
)}

{/* ── Reviews Section ── */}

        {/* ── Reviews Section ── */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-10">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
            Reviews
            {reviews.length > 0 && (
              <span className="ml-2 text-lg font-normal text-zinc-400">
                ({reviews.length})
              </span>
            )}
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-zinc-500 font-medium">No reviews yet</p>
              <p className="text-zinc-400 text-sm mt-1">
                Be the first to review this course!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                          {review.customer.name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-50 text-sm">
                          {review.customer.name}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" },
                          )}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  {review.comment && (
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}