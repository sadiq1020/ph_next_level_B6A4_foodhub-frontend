import { MealCard } from "@/components/meals/MealCard";
import { ArrowLeft, MapPin, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Meal = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  dietary?: string | null;
  isAvailable: boolean;
  category: {
    id: string;
    name: string;
  };
  provider: {
    id: string;
    businessName: string;
  };
};

type ProviderProfile = {
  id: string;
  businessName: string;
  description?: string | null;
  address?: string | null;
  logo?: string | null;
  meals: Meal[];
};

async function getProviderProfile(id: string): Promise<ProviderProfile | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/provider-profile/${id}`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      },
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.data || data;
  } catch {
    return null;
  }
}

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const provider = await getProviderProfile(id);

  if (!provider) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Back Button */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/meals"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Meals
          </Link>
        </div>
      </div>

      {/* Provider Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="w-24 h-24 rounded-2xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center shrink-0 overflow-hidden">
              {provider.logo ? (
                <Image
                  src={provider.logo}
                  alt={provider.businessName}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Store className="w-12 h-12 text-orange-500" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                {provider.businessName}
              </h1>

              {provider.description && (
                <p className="text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  {provider.description}
                </p>
              )}

              {provider.address && (
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="text-sm">{provider.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Meals Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Menu
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            {provider.meals.length}{" "}
            {provider.meals.length === 1 ? "item" : "items"} available
          </p>
        </div>

        {provider.meals.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">
              <Store className="w-12 h-12 text-zinc-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              No meals available
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400">
              This provider hasn't added any meals yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {provider.meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
