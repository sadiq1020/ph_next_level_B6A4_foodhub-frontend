// Server Component - no "use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MealCard } from "../meals/MealCard";

type Meal = {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  dietary?: string | null;
  isAvailable?: boolean;
  provider: {
    businessName: string;
  };
  category: {
    name: string;
  };
};

async function getFeaturedMeals(): Promise<Meal[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/meals?isAvailable=true`,
      {
        next: { revalidate: 1800 },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    const meals = data.data || data;

    // ✅ Always limit to 8 on frontend
    return meals.slice(0, 8);
  } catch {
    return [];
  }
}

export async function FeaturedMeals() {
  const meals = await getFeaturedMeals();

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
            {/* ✅ Fixed arrow */}
            <Link href="/meals">View All Meals →</Link>
          </Button>
        </div>

        {/* Meals Grid - max 8 */}
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

            {/* ✅ Bottom CTA - encourages user to see more */}
            <div className="text-center mt-10">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 bg-linear-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-0 text-white"
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
