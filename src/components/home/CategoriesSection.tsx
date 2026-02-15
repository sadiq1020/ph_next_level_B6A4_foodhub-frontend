"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ✅ Type for category
type Category = {
  id: string;
  name: string;
  image?: string | null;
  _count?: {
    meals: number;
  };
};

export function CategoriesSection() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.get("/categories");
        setCategories(data.data || data); // handle both {data: []} and []
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Navigate to meals page with category filter
  const handleCategoryClick = (categoryId: string) => {
    router.push(`/meals?category=${categoryId}`);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            Browse by Category
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Find exactly what you&apos;re craving from our wide selection
          </p>
        </div>

        {/* ✅ Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="w-full aspect-square rounded-xl" />
                <Skeleton className="h-4 w-2/3 mx-auto" />
              </div>
            ))}
          </div>
        )}

        {/* ✅ Categories Grid */}
        {!isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="group cursor-pointer overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg hover:shadow-orange-100 dark:hover:shadow-orange-950/20 transition-all duration-300 p-0"
              >
                {/* Category Image */}
                <div className="relative w-full aspect-square overflow-hidden">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-950/50 dark:to-rose-950/50 flex items-center justify-center">
                      <span className="text-4xl">🍽️</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Category Name */}
                <div className="p-3 text-center">
                  <h3 className="font-semibold text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {category.name}
                  </h3>
                  {category._count && (
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {category._count.meals} meals
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && categories.length === 0 && (
          <div className="text-center py-12 text-zinc-400">
            <p className="text-4xl mb-3">🍽️</p>
            <p>No categories available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
