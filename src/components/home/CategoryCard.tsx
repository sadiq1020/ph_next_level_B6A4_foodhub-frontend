// Client Component - handles navigation only
"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  image?: string | null;
  _count?: { meals: number };
};

export function CategoryCard({ category }: { category: Category }) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/meals?category=${category.id}`)}
      className="group cursor-pointer overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg transition-all duration-300 p-0"
    >
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
          <div className="w-full h-full bg-linear-to-br from-orange-100 to-rose-100 dark:from-orange-950/50 dark:to-rose-950/50 flex items-center justify-center">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
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
  );
}
