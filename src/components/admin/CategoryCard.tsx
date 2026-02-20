"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

type Category = {
  id: string;
  name: string;
  image?: string | null;
  createdAt: string;
};

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <Card className="overflow-hidden border border-zinc-200 dark:border-zinc-800 group">
      {/* Image */}
      <div className="relative w-full aspect-video bg-zinc-100 dark:bg-zinc-800">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            📁
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50 mb-1">
          {category.name}
        </h3>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => onEdit(category)}
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </Button>
          <Button
            onClick={() => onDelete(category.id)}
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
  );
}
