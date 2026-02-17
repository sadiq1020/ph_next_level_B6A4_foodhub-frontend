// Server Component - no "use client"

import { Category } from "@/types";
import { CategoryCard } from "./CategoryCard";

// type Category = {
//   id: string;
//   name: string;
//   image?: string | null;
//   _count?: { meals: number };
// };

// Server-side fetch with Next.js built-in fetch
async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      next: { revalidate: 3600 }, // cache for 1 hour, auto-revalidate
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || data;
  } catch {
    return [];
  }
}

export async function CategoriesSection() {
  // ✅ Direct async/await - no useEffect, no useState
  const categories = await getCategories();

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            Browse by Category
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Find exactly what you&apos;re craving from our wide selection
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            <p className="text-4xl mb-3">🍽️</p>
            <p>No categories available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              // Client component handles the click
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
