"use client"

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface CoursePaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function CoursePagination({
  totalPages,
  currentPage,
}: CoursePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/courses?${params.toString()}`);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        // Show first 3 pages, ellipsis, last page
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page, ellipsis, last 3 pages
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
        pages.push(1);
        pages.push(-1); // Ellipsis
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push(-2); // Ellipsis
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-3">
      {renderPageNumbers().map((page, index) => {
        if (page < 0) {
          // Ellipsis
          return (
            <div
              key={`ellipsis-${index}`}
              className="w-12 h-12 flex items-center justify-center border border-border rounded-3xl"
            >
              <span className="text-muted-foreground">...</span>
            </div>
          );
        }

        const isActive = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-3xl transition-all duration-200",
              isActive
                ? "bg-foreground text-background"
                : "border border-border hover:border-foreground hover:bg-muted"
            )}
          >
            <span className="text-lg font-medium capitalize">{page}</span>
          </button>
        );
      })}
    </div>
  );
}
