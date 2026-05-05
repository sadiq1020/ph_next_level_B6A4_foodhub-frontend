import { useEffect, useState } from "react";

export function usePagination<T>(items: T[], perPage: number) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever the items array changes (filter/search)
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));

  // Clamp page if items shrink
  const safePage = Math.min(currentPage, totalPages);

  const start = (safePage - 1) * perPage;
  const paginated = items.slice(start, start + perPage);

  return {
    currentPage: safePage,
    totalPages,
    paginated,
    setCurrentPage,
    from: items.length === 0 ? 0 : start + 1,
    to: Math.min(start + perPage, items.length),
    total: items.length,
  };
}