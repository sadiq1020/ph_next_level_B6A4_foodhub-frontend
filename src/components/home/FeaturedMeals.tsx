"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { Meal } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MealCard } from "../meals/MealCard";

export function FeaturedMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const data = await api.get("/meals?isAvailable=true");
        const allMeals = data.data || data;
        // Limit to 8 meals
        setMeals(Array.isArray(allMeals) ? allMeals.slice(0, 8) : []);
      } catch (error) {
        console.error("Failed to fetch meals:", error);
        setMeals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-5 w-96" />
            </div>
            <Skeleton className="h-10 w-40 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-9 w-24 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Featured Meals
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Handpicked delicious meals from our top providers
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-zinc-300 dark:border-zinc-700 shrink-0"
          >
            <Link href="/meals">View All Meals →</Link>
          </Button>
        </div>

        {/* Meals Grid */}
        {meals.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            <p className="text-4xl mb-3">🍽️</p>
            <p>No meals available yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-10">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-0 text-white"
              >
                <Link href="/meals">Browse All Meals →</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
