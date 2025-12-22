"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Loader2, Filter } from "lucide-react";
import {
  getQuestionHistory,
  type QuestionHistoryItem,
} from "@/service/question.service";
import { QuestionCard } from "@/components/lesson/quiz/question-history/question-card";
import {
  FilterControls,
  type SortOption,
} from "@/components/lesson/quiz/question-history/filter-controls";
import { ResultsCount } from "@/components/lesson/quiz/question-history/results-count";
import { PaginationControls } from "@/components/lesson/quiz/question-history/pagination-controls";

interface SPRQuestionHistoryCardProps {
  lessonSlug: string;
}

export function SPRQuestionHistoryCard({
  lessonSlug,
}: SPRQuestionHistoryCardProps) {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<QuestionHistoryItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [filterType, setFilterType] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

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
        isForReview: true,
        type: filterType !== "all" ? filterType : undefined,
        difficulty: filterDifficulty !== "all" ? filterDifficulty : undefined,
        sortBy: sortField,
        sortOrder: sortOrder,
      });

      setHistory(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);
    } catch (error) {
      console.error("Failed to fetch SPR question history:", error);
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

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filterType, filterDifficulty, sortBy, itemsPerPage]);

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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <History className="w-5 h-5" />
          <CardTitle>SPR Question History</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange" />
          </div>
        ) : history.length === 0 &&
          filterType === "all" &&
          filterDifficulty === "all" ? (
          <div className="text-center py-12 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No SPR question history yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
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
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4 pr-4">
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
      </CardContent>
    </Card>
  );
}
