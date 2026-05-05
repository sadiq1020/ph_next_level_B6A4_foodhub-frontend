"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type { Category, Course } from "@/types";

// ── Zod Schema ────────────────────────────────────────
const isValidUrl = (url: string | undefined) => {
  if (!url || url === "") return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const courseSchema = z.object({
  name:         z.string().min(3, "Name must be at least 3 characters"),
  description:  z.string().optional(),
  price:        z.number().min(1, "Price must be at least 1"),
  categoryId:   z.string().min(1, "Category is required"),
  image:        z.string().optional().refine(isValidUrl, { message: "Must be a valid URL" }),
  videoUrl:     z.string().optional().refine(isValidUrl, { message: "Must be a valid YouTube URL" }),
  difficulty:   z.string().optional(),
  duration:     z.number().min(1).optional(),
  lessonsCount: z.number().min(1).optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
  onSuccess: (course: Course) => void;
}

export function CourseFormDialog({
  open,
  onOpenChange,
  course,
  onSuccess,
}: CourseFormDialogProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      image: "",
      videoUrl: "",
      difficulty: "",
      duration: undefined,
      lessonsCount: undefined,
    },
  });

  const categoryId  = watch("categoryId");
  const difficulty  = watch("difficulty");

  // Fetch categories when dialog opens
  useEffect(() => {
    if (!open) return;
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const data = await api.get("/categories");
        setCategories(data.data || data);
      } catch {
        // silently fail
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [open]);

  // Pre-fill when editing
  useEffect(() => {
    if (course) {
      reset({
        name:         course.name,
        description:  course.description || "",
        price:        Number(course.price),
        categoryId:   course.category.id,
        image:        course.image || "",
        videoUrl:     course.videoUrl || "",
        difficulty:   course.difficulty || "",
        duration:     course.duration ?? undefined,
        lessonsCount: course.lessonsCount ?? undefined,
      });
    } else {
      reset({
        name: "", description: "", price: 0, categoryId: "",
        image: "", videoUrl: "", difficulty: "",
        duration: undefined, lessonsCount: undefined,
      });
    }
  }, [course, reset]);

  const onSubmit = async (data: CourseFormData) => {
    const toastId = toast.loading(course ? "Updating course..." : "Creating course...");

    try {
      let instructorId = course?.instructor?.id;

      if (!instructorId) {
        const profileResponse = await api.get("/instructor/profile");
        instructorId = profileResponse.data?.id || profileResponse.id;
        if (!instructorId) {
          toast.error("Failed to get instructor profile.", { id: toastId });
          return;
        }
      }

      const payload = {
        ...data,
        instructorId,
        price:        Number(data.price),
        image:        data.image || null,
        videoUrl:     data.videoUrl || null,
        description:  data.description || null,
        difficulty:   data.difficulty || null,
        duration:     data.duration ?? null,
        lessonsCount: data.lessonsCount ?? null,
      };

      let savedCourse;
      if (course) {
        const response = await api.put(`/courses/${course.id}`, payload);
        savedCourse = response.data || response;
      } else {
        const response = await api.post("/courses", payload);
        savedCourse = response.data || response;
      }

      toast.success(
        course ? "Course updated successfully!" : "Course created successfully!",
        { id: toastId },
      );
      onSuccess(savedCourse);
      reset();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save course";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{course ? "Edit Course" : "Add New Course"}</DialogTitle>
          <DialogDescription>
            {course ? "Update your course details" : "Fill in the details to publish a new course"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            {/* Name */}
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Course Name *</FieldLabel>
              <Input id="name" placeholder="e.g., Sourdough Bread Masterclass" {...register("name")} />
              {errors.name && <FieldError errors={[errors.name]} />}
            </Field>

            {/* Description */}
            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea id="description" placeholder="What will students learn?" rows={3} {...register("description")} />
              {errors.description && <FieldError errors={[errors.description]} />}
            </Field>

            {/* Price */}
            <Field data-invalid={!!errors.price}>
              <FieldLabel htmlFor="price">Enrollment Fee (৳) *</FieldLabel>
              <Input id="price" type="number" min="1" placeholder="1500" {...register("price", { valueAsNumber: true })} />
              {errors.price && <FieldError errors={[errors.price]} />}
            </Field>

            {/* Category */}
            <Field data-invalid={!!errors.categoryId}>
              <FieldLabel>Category *</FieldLabel>
              <Select value={categoryId} onValueChange={(v) => setValue("categoryId", v)} disabled={isLoadingCategories}>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <FieldError errors={[errors.categoryId]} />}
            </Field>

            {/* Difficulty */}
            <Field>
              <FieldLabel>Difficulty Level</FieldLabel>
              <Select value={difficulty} onValueChange={(v) => setValue("difficulty", v)}>
                <SelectTrigger><SelectValue placeholder="Select difficulty (optional)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Duration */}
            <Field data-invalid={!!errors.duration}>
              <FieldLabel htmlFor="duration">Total Duration (minutes)</FieldLabel>
              <Input id="duration" type="number" min="1" placeholder="180" {...register("duration", { valueAsNumber: true })} />
              <FieldDescription>Total length of all lessons combined</FieldDescription>
              {errors.duration && <FieldError errors={[errors.duration]} />}
            </Field>

            {/* Lessons Count */}
            <Field data-invalid={!!errors.lessonsCount}>
              <FieldLabel htmlFor="lessonsCount">Number of Lessons</FieldLabel>
              <Input id="lessonsCount" type="number" min="1" placeholder="12" {...register("lessonsCount", { valueAsNumber: true })} />
              {errors.lessonsCount && <FieldError errors={[errors.lessonsCount]} />}
            </Field>

            {/* Thumbnail URL */}
            <Field data-invalid={!!errors.image}>
              <FieldLabel htmlFor="image">Thumbnail URL</FieldLabel>
              <Input id="image" type="url" placeholder="https://images.unsplash.com/..." {...register("image")} />
              <FieldDescription>Cover image for your course (any image URL)</FieldDescription>
              {errors.image && <FieldError errors={[errors.image]} />}
            </Field>

            {/* Preview Video URL — YouTube */}
            <Field data-invalid={!!errors.videoUrl}>
              <FieldLabel htmlFor="videoUrl">Preview Video URL</FieldLabel>
              <Input
                id="videoUrl"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                {...register("videoUrl")}
              />
              <FieldDescription>
                YouTube video shown as a preview on the course detail page. Paste the full watch URL.
              </FieldDescription>
              {errors.videoUrl && <FieldError errors={[errors.videoUrl]} />}
            </Field>
          </FieldGroup>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-0 text-white px-8"
            >
              {isSubmitting ? "Saving..." : course ? "Update Course" : "Add Course"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}