import { CourseCard } from "@/components/courses/CourseCard";
import { Course } from "@/types";
import { ArrowLeft, GraduationCap, MapPin, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type InstructorProfile = {
  id: string;
  businessName: string;
  description?: string | null;
  address?: string | null;
  logo?: string | null;
  status: string;
  courses: Course[];
  _count: { courses: number };
};

async function getInstructorProfile(id: string): Promise<InstructorProfile | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/instructor-profiles/${id}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || data;
  } catch {
    return null;
  }
}

export default async function InstructorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const instructor = await getInstructorProfile(id);

  if (!instructor) notFound();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Back Button */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </div>
      </div>

      {/* Instructor Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="w-24 h-24 rounded-2xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center shrink-0 overflow-hidden">
              {instructor.logo ? (
                <Image
                  src={instructor.logo}
                  alt={instructor.businessName}
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
                {instructor.businessName}
              </h1>

              {instructor.description && (
                <p className="text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  {instructor.description}
                </p>
              )}

              <div className="flex items-center gap-4 flex-wrap">
                {instructor.address && (
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="text-sm">{instructor.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {instructor._count.courses}{" "}
                    {instructor._count.courses === 1 ? "course" : "courses"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Courses
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            {instructor.courses.length}{" "}
            {instructor.courses.length === 1 ? "course" : "courses"} available
          </p>
        </div>

        {instructor.courses.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-12 h-12 text-zinc-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              No courses yet
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400">
              This instructor hasn&apos;t published any courses yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {instructor.courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}