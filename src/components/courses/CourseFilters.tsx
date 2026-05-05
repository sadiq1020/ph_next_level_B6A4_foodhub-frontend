"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { Category } from "@/types";
import { ArrowUpDown, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";

export type FilterState = {
  search: string;
  categoryId: string;
  difficulty: string;
  minPrice: string;
  maxPrice: string;
  sort: string;  // ← new
};

const DIFFICULTY_OPTIONS = [
  {
    value: "BEGINNER",
    label: "Beginner",
    color:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800",
  },
  {
    value: "INTERMEDIATE",
    label: "Intermediate",
    color:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  },
  {
    value: "ADVANCED",
    label: "Advanced",
    color:
      "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",
  },
];

const SORT_OPTIONS = [
  { value: "newest",       label: "Newest First" },
  { value: "price_asc",   label: "Price: Low to High" },
  { value: "price_desc",  label: "Price: High to Low" },
  { value: "most_reviewed", label: "Most Reviewed" },
];

const DEFAULT_FILTERS: FilterState = {
  search: "",
  categoryId: "",
  difficulty: "",
  minPrice: "",
  maxPrice: "",
  sort: "newest",
};

interface CourseFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

export function CourseFilters({ onFilterChange, initialFilters }: CourseFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchInput, setSearchInput] = useState(initialFilters?.search || "");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.get("/categories");
        setCategories(data.data || data);
      } catch {
        // silently fail
      }
    };
    fetchCategories();
  }, []);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  // Debounce search 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFilterChange("search", searchInput);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const toggleDifficulty = (value: string) => {
    const next = filters.difficulty === value ? "" : value;
    handleFilterChange("difficulty", next);
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput("");
    onFilterChange(DEFAULT_FILTERS);
  };

  const hasActiveFilters =
    filters.search ||
    filters.categoryId ||
    filters.difficulty ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.sort !== "newest";

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50 font-semibold">
          <SlidersHorizontal className="w-4 h-4 text-orange-500" />
          Filters
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1 h-7"
          >
            <X className="w-3 h-3" />
            Clear All
          </Button>
        )}
      </div>

      {/* Sort — new */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide flex items-center gap-1.5">
          <ArrowUpDown className="w-3 h-3" />
          Sort By
        </label>
        <Select
          value={filters.sort || "newest"}
          onValueChange={(value) => handleFilterChange("sort", value)}
        >
          <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700">
            <SelectValue placeholder="Newest First" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Search
        </label>
        <Input
          placeholder="Search courses..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="rounded-xl border-zinc-200 dark:border-zinc-700"
        />
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Category
        </label>
        <Select
          value={filters.categoryId || "all"}
          onValueChange={(value) =>
            handleFilterChange("categoryId", value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Difficulty */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Difficulty
        </label>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTY_OPTIONS.map((option) => {
            const isSelected = filters.difficulty === option.value;
            return (
              <button
                key={option.value}
                onClick={() => toggleDifficulty(option.value)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200
                  ${
                    isSelected
                      ? option.color + " border-current scale-105"
                      : "bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                  }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Price Range (৳)
        </label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            className="rounded-xl border-zinc-200 dark:border-zinc-700"
            min={0}
          />
          <span className="text-zinc-400 text-sm shrink-0">to</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            className="rounded-xl border-zinc-200 dark:border-zinc-700"
            min={0}
          />
        </div>
      </div>
    </div>
  );
}