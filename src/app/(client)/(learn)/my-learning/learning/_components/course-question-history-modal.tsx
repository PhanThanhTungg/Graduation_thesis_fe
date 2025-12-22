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
} from "@/components/lesson/quiz/question-history/filter-controls";
import { ResultsCount } from "@/components/lesson/quiz/question-history/results-count";
import { QuestionCard } from "@/components/lesson/quiz/question-history/question-card";
import { PaginationControls } from "@/components/lesson/quiz/question-history/pagination-controls";

interface CourseQuestionHistoryModalProps {
  courseSlug: string;
  lessons: { slug: string; title: string; chapterTitle: string }[];
}

export function CourseQuestionHistoryModal({
  courseSlug,
  lessons,
}: CourseQuestionHistoryModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<
    (QuestionHistoryItem & { lessonTitle: string; chapterTitle: string })[]
  >([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [filterType, setFilterType] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const fetchHistory = useCallback(async () => {
    if (lessons.length === 0) return;

    setLoading(true);
    try {
      const [sortField, sortOrder] = sortBy.split("-") as [
        "date" | "score",
        "asc" | "desc",
      ];

      const allHistory: (QuestionHistoryItem & {
        lessonTitle: string;
        chapterTitle: string;
      })[] = [];

      for (const lesson of lessons) {
        try {
          const response = await getQuestionHistory(lesson.slug, {
            page: 1,
            limit: 1000,
            type: filterType !== "all" ? filterType : undefined,
            difficulty:
              filterDifficulty !== "all" ? filterDifficulty : undefined,
            sortBy: sortField,
            sortOrder: sortOrder,
          });

          const lessonHistory = response.data.map((item) => ({
            ...item,
            lessonTitle: lesson.title,
            chapterTitle: lesson.chapterTitle,
          }));

          allHistory.push(...lessonHistory);
        } catch (error) {
          console.error(
            `Failed to fetch history for lesson ${lesson.slug}:`,
            error,
          );
        }
      }

      let filteredHistory = allHistory;

      if (filterType !== "all") {
        filteredHistory = filteredHistory.filter(
          (item) => item.type === filterType,
        );
      }

      if (filterDifficulty !== "all") {
        filteredHistory = filteredHistory.filter(
          (item) => item.difficulty === filterDifficulty,
        );
      }

      if (sortField === "date") {
        filteredHistory.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
      } else if (sortField === "score") {
        filteredHistory.sort((a, b) => {
          const scoreA = a.score ?? 0;
          const scoreB = b.score ?? 0;
          return sortOrder === "asc" ? scoreA - scoreB : scoreB - scoreA;
        });
      }

      const total = filteredHistory.length;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedHistory = filteredHistory.slice(startIndex, endIndex);

      setHistory(paginatedHistory);
      setTotalItems(total);
      setTotalPages(Math.ceil(total / itemsPerPage));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [
    lessons,
    currentPage,
    itemsPerPage,
    filterType,
    filterDifficulty,
    sortBy,
  ]);

  useEffect(() => {
    if (open && lessons.length > 0) {
      fetchHistory();
    }
  }, [open, lessons, fetchHistory]);

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
                        <div key={item.id} className="space-y-2">
                          <div className="text-xs text-muted-foreground">
                            {item.chapterTitle} - {item.lessonTitle}
                          </div>
                          <QuestionCard
                            item={item}
                            isExpanded={expandedId === item.id}
                            onToggle={() => handleToggleExpand(item.id)}
                          />
                        </div>
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
