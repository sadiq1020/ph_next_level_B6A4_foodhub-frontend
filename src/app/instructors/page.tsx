"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { GraduationCap, MapPin, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Instructor = {
  id: string;
  businessName: string;
  description?: string | null;
  address?: string | null;
  logo?: string | null;
  _count: {
    courses: number;
  };
};

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const data = await api.get("/instructor-profiles");
        setInstructors(data.data || data);
      } catch {
        setInstructors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-10 w-64 mb-3" />
            <Skeleton className="h-6 w-96" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full aspect-video" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
              Our Instructors
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              Learn from professional chefs and culinary experts
            </p>
          </div>
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="container mx-auto px-4 py-8">
        {instructors.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">
              <Store className="w-12 h-12 text-zinc-400" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              No instructors yet
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Check back soon for new culinary instructors
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((instructor) => (
              <Link
                key={instructor.id}
                href={`/instructor-profiles/${instructor.id}`}
              >
                <Card className="overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg transition-all group cursor-pointer">
                  {/* Logo/Image */}
                  <div className="relative w-full aspect-video bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-950/50 dark:to-rose-950/50">
                    {instructor.logo ? (
                      <Image
                        src={instructor.logo}
                        alt={instructor.businessName}
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
                      {instructor.businessName}
                    </h3>

                    {instructor.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
                        {instructor.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                      {instructor.address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="truncate">{instructor.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mt-3 text-sm font-medium text-orange-600 dark:text-orange-400">
                      <GraduationCap className="w-4 h-4" />
                      <span>
                        {instructor._count.courses}{" "}
                        {instructor._count.courses === 1 ? "course" : "courses"}
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