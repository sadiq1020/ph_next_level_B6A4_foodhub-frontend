"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

export function MealCard({ meal }: { meal: Meal }) {
  const router = useRouter();

  // Dietary badge color
  const getDietaryColor = (dietary: string | null | undefined) => {
    if (!dietary || typeof dietary !== "string")
      return "bg-zinc-100 text-zinc-700";
    if (dietary === "VEGAN")
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    if (dietary === "VEGETARIAN")
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
    if (dietary === "NON_VEG")
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    return "bg-zinc-100 text-zinc-700";
  };

  // ✅ Handle Add to Cart click
  // Stops card click from firing when button clicked
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // ← prevents card onClick from firing
    // Cart logic will be implemented later
    console.log("Add to cart:", meal.id);
  };

  // ✅ Check if out of stock
  const isOutOfStock = meal.isAvailable === false;

  return (
    <Card
      onClick={() => !isOutOfStock && router.push(`/meals/${meal.id}`)}
      className={`group overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-all duration-300 p-0
        ${
          isOutOfStock
            ? "opacity-70 cursor-not-allowed" // ✅ Out of stock style
            : "cursor-pointer hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg hover:shadow-orange-100 dark:hover:shadow-orange-950/20"
        }`}
    >
      {/* Meal Image */}
      <div className="relative w-full aspect-video overflow-hidden">
        {meal.image ? (
          <Image
            src={meal.image}
            alt={meal.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-transform duration-300
              ${!isOutOfStock && "group-hover:scale-105"}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-950/50 dark:to-rose-950/50 flex items-center justify-center">
            <span className="text-4xl">🍽️</span>
          </div>
        )}

        {/* ✅ Out of Stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-red-500 px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Dietary Badge */}
        {meal.dietary && typeof meal.dietary === "string" && (
          <div className="absolute top-2 left-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${getDietaryColor(meal.dietary)}`}
            >
              {meal.dietary.replace("_", " ")}
            </span>
          </div>
        )}
      </div>

      {/* Meal Info */}
      <div className="p-4 space-y-2">
        {/* Category */}
        <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
          {meal.category.name}
        </p>

        {/* Meal Name */}
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
          {meal.name}
        </h3>

        {/* Provider Name */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">
          🏪 {meal.provider.businessName}
        </p>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
            ৳{meal.price}
          </span>

          {/* ✅ Add to Cart button */}
          {isOutOfStock ? (
            <span className="text-xs text-red-500 font-medium">
              Unavailable
            </span>
          ) : (
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white border-0 gap-1.5 text-xs px-3"
            >
              <ShoppingCart className="w-3 h-3" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
