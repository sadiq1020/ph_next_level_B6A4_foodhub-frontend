"use client";

import { MealCard } from "@/components/meals/MealCard";
import { FilterState, MealFilters } from "@/components/meals/MealFilters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { Meal } from "@/types";
import { UtensilsCrossed } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

// Loading skeleton grid
function MealsGridSkeleton() {
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

// ✅ Separate component that uses useSearchParams
function MealsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Read initial filters from URL params
  const initialFilters = {
    search: searchParams.get("search") || "",
    categoryId: searchParams.get("category") || "",
    dietary: [],
    minPrice: "",
    maxPrice: "",
  };

  // Fetch meals with filters
  const fetchMeals = useCallback(async (filters: FilterState) => {
    setIsLoading(true);
    try {
      // Build query string from filters
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.categoryId) params.set("categoryId", filters.categoryId);
      if (filters.minPrice) params.set("minPrice", filters.minPrice);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
      if (filters.dietary.length > 0) {
        params.set("dietary", filters.dietary.join(","));
      }

      const query = params.toString();
      const data = await api.get(`/meals${query ? `?${query}` : ""}`);
      const result = data.data || data;
      setMeals(Array.isArray(result) ? result : []);
      setTotalCount(data.total || result.length || 0);
    } catch {
      setMeals([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount with initial URL filters
  useEffect(() => {
    fetchMeals(initialFilters as FilterState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Called by MealFilters whenever filters change
  const handleFilterChange = (filters: FilterState) => {
    fetchMeals(filters);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Page Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Browse Meals
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            {isLoading
              ? "Finding meals..."
              : `${totalCount} meal${totalCount !== 1 ? "s" : ""} available`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-4">
              <MealFilters
                onFilterChange={handleFilterChange}
                initialFilters={initialFilters}
              />
            </div>
          </aside>

          {/* Meals Grid */}
          <main className="flex-1">
            {isLoading ? (
              <MealsGridSkeleton />
            ) : meals.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <UtensilsCrossed className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                  No meals found
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
                  Try adjusting your filters or search term to find what
                  you&apos;re looking for.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/meals")}
                  className="rounded-full"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {meals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ✅ Main page component with Suspense wrapper
export default function AllMealsPage() {
  return (
    <Suspense fallback={<MealsGridSkeleton />}>
      <MealsContent />
    </Suspense>
  );
}
