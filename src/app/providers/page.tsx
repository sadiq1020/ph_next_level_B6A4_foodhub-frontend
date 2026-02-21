import { Card } from "@/components/ui/card";
import { ChefHat, MapPin, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Provider = {
  id: string;
  businessName: string;
  description?: string | null;
  address?: string | null;
  logo?: string | null;
  _count: {
    meals: number;
  };
};

async function getProviders(): Promise<Provider[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/provider-profile`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      },
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || data;
  } catch {
    return [];
  }
}

export default async function ProvidersPage() {
  const providers = await getProviders();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
              Our Providers
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              Discover restaurants and food providers in your area
            </p>
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="container mx-auto px-4 py-8">
        {providers.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">
              <Store className="w-12 h-12 text-zinc-400" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              No providers yet
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Check back soon for new food providers
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <Link key={provider.id} href={`/provider-profile/${provider.id}`}>
                <Card className="overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg transition-all group cursor-pointer">
                  {/* Logo/Image */}
                  <div className="relative w-full aspect-video bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-950/50 dark:to-rose-950/50">
                    {provider.logo ? (
                      <Image
                        src={provider.logo}
                        alt={provider.businessName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store className="w-16 h-16 text-orange-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {provider.businessName}
                    </h3>

                    {provider.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
                        {provider.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                      {provider.address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{provider.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mt-3 text-sm font-medium text-orange-600 dark:text-orange-400">
                      <ChefHat className="w-4 h-4" />
                      <span>
                        {provider._count.meals}{" "}
                        {provider._count.meals === 1 ? "meal" : "meals"}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
