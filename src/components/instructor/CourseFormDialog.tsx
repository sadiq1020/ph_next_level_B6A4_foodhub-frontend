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

// ── Zod Schema ─────────────────────────────────────────
const courseSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  price: z.number().min(1, "Price must be at least 1"),
  categoryId: z.string().min(1, "Category is required"),
  image: z
    .string()
    .optional()
    .refine(
      (url) => {
        // Allow empty string
        if (!url || url === "") return true;

        // Check if valid URL
        try {
          const urlObj = new URL(url);
          const allowedDomains = ["images.unsplash.com"];
          return allowedDomains.includes(urlObj.hostname);
        } catch {
          return false;
        }
      },
      {
        message:
          "Image must be from images.unsplash.com or your CloudFront domain",
      },
    ),
  tags: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null; // null = add mode, Course = edit mode
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
      tags: "",
    },
  });

  const categoryId = watch("categoryId");
  const tags = watch("tags");

  //  Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const data = await api.get("/categories");
        setCategories(data.data || data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  //  Pre-fill form when editing
  useEffect(() => {
    if (course) {
      reset({
        name: course.name,
        description: course.description || "",
        price: Number(course.price),
        categoryId: course.category.id,
        image: course.image || "",
        tags: Array.isArray(course.tags)
          ? course.tags[0] || ""
          : (course as any).dietary?.[0] || "",
      });
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        image: "",
        tags: "",
      });
    }
  }, [course, reset]);

  //  Submit handler - updated
  const onSubmit = async (data: CourseFormData) => {
    const toastId = toast.loading(
      course ? "Updating course..." : "Creating course...",
    );

    try {
      let instructorId = course?.instructor?.id;

      if (!instructorId) {
        try {
          const profileResponse = await api.get("/instructor/profile");
          instructorId = profileResponse.data?.id || profileResponse.id;
        } catch (error) {
          toast.error("Failed to get instructor profile. Please try again.", {
            id: toastId,
          });
          return;
        }
      }

      const payload = {
        ...data,
        instructorId,
        price: Number(data.price),
        image: data.image || null,
        tags: data.tags ? [data.tags] : null,
        description: data.description || null,
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
      const message =
        error instanceof Error ? error.message : "Failed to save course";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{course ? "Edit Course" : "Add New Course"}</DialogTitle>
          <DialogDescription>
            {course
              ? "Update your course details"
              : "Fill in the details to add a new course"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            {/* Name */}
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Course Name *</FieldLabel>
              <Input
                id="name"
                placeholder="e.g., Advanced React Patterns"
                {...register("name")}
              />
              {errors.name && <FieldError errors={[errors.name]} />}
            </Field>

            {/* Description */}
            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                placeholder="Describe your course..."
                rows={3}
                {...register("description")}
              />
              {errors.description && (
                <FieldError errors={[errors.description]} />
              )}
            </Field>

            {/* Price */}
            <Field data-invalid={!!errors.price}>
              <FieldLabel htmlFor="price">Price (৳) *</FieldLabel>
              <Input
                id="price"
                type="number"
                min="1"
                placeholder="200"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && <FieldError errors={[errors.price]} />}
            </Field>

            {/* Category */}
            <Field data-invalid={!!errors.categoryId}>
              <FieldLabel>Category *</FieldLabel>
              <Select
                value={categoryId}
                onValueChange={(value) => setValue("categoryId", value)}
                disabled={isLoadingCategories}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <FieldError errors={[errors.categoryId]} />}
            </Field>

            {/* Image URL */}
            <Field data-invalid={!!errors.image}>
              <FieldLabel htmlFor="image">Image URL</FieldLabel>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                {...register("image")}
              />
              <FieldDescription>
                Enter a valid image URL (optional)
              </FieldDescription>
              {errors.image && <FieldError errors={[errors.image]} />}
            </Field>

            {/* Tags */}
            <Field>
              <FieldLabel>Difficulty Level</FieldLabel>
              <Select
                value={tags}
                onValueChange={(value) => setValue("tags", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
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
