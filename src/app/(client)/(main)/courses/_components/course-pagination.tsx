"use client"

import { cn } from "@/lib/utils";
import { useState } from "react";

interface CoursePaginationProps {
  totalPages: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export default function CoursePagination({
  totalPages,
  currentPage = 1,
  onPageChange,
}: CoursePaginationProps) {
  const [activePage, setActivePage] = useState(currentPage);

  const handlePageChange = (page: number) => {
    setActivePage(page);
    onPageChange?.(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (activePage > 2) {
        pages.push(-1); // Ellipsis
      }
      if (activePage > 1 && activePage < totalPages) {
        pages.push(activePage);
      }
      if (activePage < totalPages - 1) {
        pages.push(-2); // Ellipsis
      }
      pages.push(totalPages);
    }

    return pages;
  };

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

        const isActive = page === activePage;

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
