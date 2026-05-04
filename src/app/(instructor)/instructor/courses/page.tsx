"use client";

import { CourseFormDialog } from "@/components/instructor/CourseFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { Course } from "@/types";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function InstructorCoursesPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const hasFetched = useRef(false);

  //  Protected route - instructor only
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }

    if (!isPending && session?.user) {
      const userRole = (session.user as { role?: string }).role;
      if (userRole !== "INSTRUCTOR") {
        router.push("/");
      }
    }
  }, [session, isPending, router]);

  //  Fetch instructor's courses — only once per mount
  useEffect(() => {
    if (!session?.user) return;
    if (hasFetched.current) return;

    const fetchCourses = async () => {
      try {
        hasFetched.current = true;
        setIsLoading(true);
        const data = await api.get("/courses/my-courses");
        setCourses(data.data || data);
      } catch (error) {
        // console.error("Failed to fetch courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [session?.user?.id]); // ✅ Stable string, not the whole session object

  if (isPending) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) return null;

  //  Delete course handler
  const handleDelete = async () => {
    if (!courseToDelete) return;

    const toastId = toast.loading("Deleting course...");

    try {
      await api.delete(`/courses/${courseToDelete}`);
      toast.success("Course deleted successfully", { id: toastId });

      // Remove from list
      setCourses(courses.filter((m) => m.id !== courseToDelete));
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete course";
      toast.error(message, { id: toastId });
    }
  };

  //  Open edit dialog
  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsDialogOpen(true);
  };

  //  Open add dialog
  const handleAdd = () => {
    setEditingCourse(null);
    setIsDialogOpen(true);
  };

  //  After successful add/edit
  const handleCourseSaved = (savedCourse: Course) => {
    if (editingCourse) {
      // Update existing
      setCourses(courses.map((m) => (m.id === savedCourse.id ? savedCourse : m)));
    } else {
      // Add new
      setCourses([savedCourse, ...courses]);
    }
    setIsDialogOpen(false);
    setEditingCourse(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Page Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                My Courses
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">
                Manage your courses
              </p>
            </div>
            <Button
              onClick={handleAdd}
              className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-0 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Course
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="w-full aspect-video rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </Card>
            ))}
          </div>
        ) : courses.length === 0 ? (
          // Empty State
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-full bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center mx-auto mb-6">
              <Plus className="w-12 h-12 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              No courses yet
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm mx-auto">
              Start by adding your first course to the list
            </p>
            <Button
              onClick={handleAdd}
              className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-0 text-white px-8"
            >
              Add Your First Course
            </Button>
          </div>
        ) : (
          // Courses Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden border border-zinc-200 dark:border-zinc-800"
              >
                {/* Image */}
                <div className="relative w-full aspect-video bg-zinc-100 dark:bg-zinc-800">
                  {course.image ? (
                    <Image
                      src={course.image}
                      alt={course.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🎬
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1">
                    {course.category.name}
                  </p>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2 line-clamp-1">
                    {course.name}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4">
                    {course.description || "No description"}
                  </p>
                  <p className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4">
                    ৳{course.price}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(course)}
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => {
                        setCourseToDelete(course.id);
                        setDeleteDialogOpen(true);
                      }}
                      variant="destructive"
                      size="sm"
                      className="flex-1 gap-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Course Dialog */}
      <CourseFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        course={editingCourse}
        onSuccess={handleCourseSaved}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this course? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
