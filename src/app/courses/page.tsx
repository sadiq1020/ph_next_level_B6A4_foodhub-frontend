"use client";

import { CourseCard } from "@/components/courses/CourseCard";
import { CourseFilters, FilterState } from "@/components/courses/CourseFilters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { Course } from "@/types";
import { GraduationCap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

function CoursesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
        >
          <Skeleton className="aspect-video w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between pt-1">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CoursesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const initialFilters = {
    search: searchParams.get("search") || "",
    categoryId: searchParams.get("category") || "",
    difficulty: "",
    minPrice: "",
    maxPrice: "",
  };

  const fetchCourses = useCallback(async (filters: FilterState) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search)     params.set("search", filters.search);
      if (filters.categoryId) params.set("categoryId", filters.categoryId);
      if (filters.difficulty) params.set("difficulty", filters.difficulty);
      if (filters.minPrice)   params.set("minPrice", filters.minPrice);
      if (filters.maxPrice)   params.set("maxPrice", filters.maxPrice);

      const query = params.toString();
      const data = await api.get(`/courses${query ? `?${query}` : ""}`);
      const result = data.data || data;
      setCourses(Array.isArray(result) ? result : []);
      setTotalCount(data.total || result.length || 0);
    } catch {
      setCourses([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses(initialFilters as FilterState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Page Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Browse Courses
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            {isLoading
              ? "Finding courses..."
              : `${totalCount} course${totalCount !== 1 ? "s" : ""} available`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-4">
              <CourseFilters
                onFilterChange={fetchCourses}
                initialFilters={initialFilters}
              />
            </div>
          </aside>

          {/* Courses Grid */}
          <main className="flex-1">
            {isLoading ? (
              <CoursesGridSkeleton />
            ) : courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <GraduationCap className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                  No courses found
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
                  Try adjusting your filters or search term.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/courses")}
                  className="rounded-full"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AllCoursesPage() {
  return (
    <Suspense fallback={<CoursesGridSkeleton />}>
      <CoursesContent />
    </Suspense>
  );
}