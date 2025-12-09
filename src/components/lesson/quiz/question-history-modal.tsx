"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Loader2, Filter } from "lucide-react";

import {
  getQuestionHistory,
  type QuestionHistoryItem,
} from "@/service/question.service";
import {
  FilterControls,
  type SortOption,
} from "./question-history/filter-controls";
import { ResultsCount } from "./question-history/results-count";
import { QuestionCard } from "./question-history/question-card";
import { PaginationControls } from "./question-history/pagination-controls";

interface QuestionHistoryModalProps {
  lessonSlug?: string;
}

export function QuestionHistoryModal({
  lessonSlug,
}: QuestionHistoryModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<QuestionHistoryItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filter states
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  // Fetch data function
  const fetchHistory = useCallback(async () => {
    if (!lessonSlug) return;

    setLoading(true);
    try {
      const [sortField, sortOrder] = sortBy.split("-") as [
        "date" | "score",
        "asc" | "desc",
      ];

      const response = await getQuestionHistory(lessonSlug, {
        page: currentPage,
        limit: itemsPerPage,
        type: filterType,
        difficulty: filterDifficulty,
        sortBy: sortField,
        sortOrder: sortOrder,
      });

      setHistory(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [
    lessonSlug,
    currentPage,
    itemsPerPage,
    filterType,
    filterDifficulty,
    sortBy,
  ]);

  // Fetch data when modal opens or filters/pagination change
  useEffect(() => {
    if (open && lessonSlug) {
      fetchHistory();
    }
  }, [open, lessonSlug, fetchHistory]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterDifficulty, sortBy, itemsPerPage]);

  // Calculate display indices
  const { startIndex, endIndex } = useMemo(
    () => ({
      startIndex: (currentPage - 1) * itemsPerPage,
      endIndex: Math.min(
        (currentPage - 1) * itemsPerPage + itemsPerPage,
        totalItems,
      ),
    }),
    [currentPage, itemsPerPage, totalItems],
  );

  const handleResetFilters = useCallback(() => {
    setFilterType("all");
    setFilterDifficulty("all");
    setSortBy("date-desc");
  }, []);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="w-4 h-4 mr-2" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-4xl h-[90vh] max-h-[90vh] flex flex-col gap-0 p-0"
        style={{ zIndex: 100 }}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle>Question History</DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col px-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange" />
            </div>
          ) : history.length === 0 &&
            filterType === "all" &&
            filterDifficulty === "all" ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No question history yet</p>
            </div>
          ) : (
            <div className="flex-1 min-h-0 flex flex-col gap-4 py-4">
              <FilterControls
                filterType={filterType}
                filterDifficulty={filterDifficulty}
                sortBy={sortBy}
                onFilterTypeChange={setFilterType}
                onFilterDifficultyChange={setFilterDifficulty}
                onSortByChange={setSortBy}
                onReset={handleResetFilters}
              />

              <ResultsCount
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={totalItems}
              />

              {history.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No questions match your filters</p>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1 min-h-0">
                    <div className="space-y-4 pr-4 pb-4">
                      {history.map((item) => (
                        <QuestionCard
                          key={item.id}
                          item={item}
                          isExpanded={expandedId === item.id}
                          onToggle={() => handleToggleExpand(item.id)}
                        />
                      ))}
                    </div>
                  </ScrollArea>

                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
