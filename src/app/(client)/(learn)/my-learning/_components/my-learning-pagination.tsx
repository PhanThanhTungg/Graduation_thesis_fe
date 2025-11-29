"use client";

import { cn } from "@/lib/utils";

interface MyLearningPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function MyLearningPagination({
  totalPages,
  currentPage,
  onPageChange,
}: MyLearningPaginationProps) {
  const handlePageChange = (page: number) => {
    onPageChange(page);
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
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1);
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push(-2);
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
                : "border border-border hover:border-foreground hover:bg-muted",
            )}
          >
            <span className="text-lg font-medium capitalize">{page}</span>
          </button>
        );
      })}
    </div>
  );
}
