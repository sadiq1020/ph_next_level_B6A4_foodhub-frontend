"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import { api } from "@/lib/api";

type Category = {
  id: string;
  name: string;
  image?: string | null;
  createdAt: string;
};

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
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
          const allowedDomains = [
            "images.unsplash.com",
            "deifkwefumgah.cloudfront.net",
          ];
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
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSuccess: (category: Category) => void;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: CategoryFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  // ✅ Only reset when category changes or dialog opens, not on every render
  useEffect(() => {
    if (open) {
      if (category) {
        reset({
          name: category.name,
          image: category.image || "",
        });
      } else {
        reset({
          name: "",
          image: "",
        });
      }
    }
  }, [category, open, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    const toastId = toast.loading(
      category ? "Updating category..." : "Creating category...",
    );

    try {
      const payload = {
        name: data.name,
        image: data.image || null,
      };

      let savedCategory;
      if (category) {
        const response = await api.put(`/categories/${category.id}`, payload);
        savedCategory = response.data || response;
      } else {
        const response = await api.post("/categories", payload);
        savedCategory = response.data || response;
      }

      toast.success(
        category
          ? "Category updated successfully!"
          : "Category created successfully!",
        { id: toastId },
      );

      onSuccess(savedCategory);
      reset();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to save category";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()} // ✅ Prevent closing when clicking outside
      >
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Update category details"
              : "Fill in the details to add a new category"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            {/* Name */}
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Category Name *</FieldLabel>
              <Input
                id="name"
                placeholder="e.g., Desserts"
                autoComplete="off" // ✅ Prevent browser autocomplete
                {...register("name")}
              />
              {errors.name && <FieldError errors={[errors.name]} />}
            </Field>

            {/* Image URL */}
            <Field data-invalid={!!errors.image}>
              <FieldLabel htmlFor="image">Image URL</FieldLabel>
              <Input
                id="image"
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                autoComplete="off" // ✅ Prevent browser autocomplete
                {...register("image")}
              />
              <FieldDescription>
                Must be from images.unsplash.com or CloudFront (optional)
              </FieldDescription>
              {errors.image && <FieldError errors={[errors.image]} />}
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
              {isSubmitting
                ? "Saving..."
                : category
                  ? "Update Category"
                  : "Add Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
