"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  History,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  getQuestionHistory,
  QUESTION_TYPE_LABELS,
  DIFFICULTY_LABELS,
  TypeQuestion,
  Difficulty,
  type QuestionHistoryItem,
  type QuestionHistoryResponse,
} from "@/service/question.service";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface QuestionHistoryModalProps {
  lessonSlug?: string;
}

type SortOption = "date-desc" | "date-asc" | "score-desc" | "score-asc";

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

  // Sort state
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  // Fetch data function
  const fetchHistory = async () => {
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
  };

  // Fetch data when modal opens or filters/pagination change
  useEffect(() => {
    if (open && lessonSlug) {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    open,
    lessonSlug,
    currentPage,
    itemsPerPage,
    filterType,
    filterDifficulty,
    sortBy,
  ]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterDifficulty, sortBy, itemsPerPage]);

  // Calculate display indices
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const parseStatement = (statement: string) => {
    try {
      const parsed = JSON.parse(statement);
      return parsed.statement || parsed.question || statement;
    } catch {
      return statement;
    }
  };

  const getScoreStatus = (item: QuestionHistoryItem) => {
    if (item.answer === null) {
      return {
        icon: Clock,
        color: "text-muted-foreground",
        label: "Not answered",
      };
    }
    if ((item.score ?? 0) >= 50) {
      return {
        icon: CheckCircle2,
        color: "text-green-600 dark:text-green-400",
        label: `${item.score}`,
      };
    }
    return {
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      label: `${item.score}`,
    };
  };

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
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No question history yet</p>
            </div>
          ) : (
            <div className="flex-1 min-h-0 flex flex-col gap-4 py-4">
              {/* Filters and Sort Controls */}
              <div className="flex flex-col gap-3 shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Filter className="w-4 h-4 text-orange" />
                    Filters & Sorting
                  </h3>
                  {(filterType !== "all" ||
                    filterDifficulty !== "all" ||
                    sortBy !== "date-desc") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => {
                        setFilterType("all");
                        setFilterDifficulty("all");
                        setSortBy("date-desc");
                      }}
                    >
                      Reset Filters
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Question Type
                    </label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="h-10 border-2 hover:border-orange/50 transition-colors">
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent style={{ zIndex: 150 }}>
                        <SelectItem value="all">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange opacity-70" />
                            All Types
                          </div>
                        </SelectItem>
                        {Object.values(TypeQuestion).map((type) => (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-orange" />
                              {QUESTION_TYPE_LABELS[type]}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Difficulty Level
                    </label>
                    <Select
                      value={filterDifficulty}
                      onValueChange={setFilterDifficulty}
                    >
                      <SelectTrigger className="h-10 border-2 hover:border-orange/50 transition-colors">
                        <SelectValue placeholder="Select difficulty..." />
                      </SelectTrigger>
                      <SelectContent style={{ zIndex: 150 }}>
                        <SelectItem value="all">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            All Levels
                          </div>
                        </SelectItem>
                        {Object.values(Difficulty).map((level) => {
                          const colorMap: Record<Difficulty, string> = {
                            [Difficulty.VERY_EASY]: "bg-emerald-400",
                            [Difficulty.EASY]: "bg-green-500",
                            [Difficulty.MEDIUM]: "bg-yellow-500",
                            [Difficulty.HARD]: "bg-orange-500",
                            [Difficulty.VERY_HARD]: "bg-red-600",
                          };
                          return (
                            <SelectItem key={level} value={level}>
                              <div className="flex items-center gap-2">
                                <div
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    colorMap[level],
                                  )}
                                />
                                {DIFFICULTY_LABELS[level]}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Sort By
                    </label>
                    <Select
                      value={sortBy}
                      onValueChange={(value) => setSortBy(value as SortOption)}
                    >
                      <SelectTrigger className="h-10 border-2 hover:border-orange/50 transition-colors">
                        <SelectValue placeholder="Select sorting..." />
                      </SelectTrigger>
                      <SelectContent style={{ zIndex: 150 }}>
                        <SelectItem value="date-desc">
                          <div className="flex items-center gap-2">
                            <ArrowUpDown className="w-3 h-3" />
                            Newest First
                          </div>
                        </SelectItem>
                        <SelectItem value="date-asc">
                          <div className="flex items-center gap-2">
                            <ArrowUpDown className="w-3 h-3 rotate-180" />
                            Oldest First
                          </div>
                        </SelectItem>
                        <SelectItem value="score-desc">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            Highest Score
                          </div>
                        </SelectItem>
                        <SelectItem value="score-asc">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-3 h-3 text-red-500" />
                            Lowest Score
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Results count */}
              <div className="flex items-center justify-between px-1 shrink-0">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {totalItems === 0 ? 0 : startIndex + 1}-{endIndex}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {totalItems}
                  </span>{" "}
                  questions
                </p>
                {totalItems > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="w-3 h-3 text-orange" />
                    <span>Generated by AI</span>
                  </div>
                )}
              </div>

              {/* Questions List */}
              {history.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No questions match your filters</p>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1 min-h-0">
                    <div className="space-y-4 pr-4 pb-4">
                      {history.map((item) => {
                        const status = getScoreStatus(item);
                        const StatusIcon = status.icon;
                        const isExpanded = expandedId === item.id;

                        return (
                          <div
                            key={item.id}
                            className={cn(
                              "rounded-lg border bg-card transition-all cursor-pointer",
                              isExpanded
                                ? "ring-2 ring-orange/20 border-orange/50"
                                : "hover:bg-accent/50",
                            )}
                            onClick={() =>
                              setExpandedId(isExpanded ? null : item.id)
                            }
                          >
                            <div className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium line-clamp-2">
                                    {parseStatement(item.statement)}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                    <span className="px-2 py-0.5 rounded-full bg-orange/10 text-orange text-xs">
                                      {QUESTION_TYPE_LABELS[item.type]}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs">
                                      {DIFFICULTY_LABELS[item.difficulty]}
                                    </span>
                                    <span className="text-xs">
                                      {formatDate(item.createdAt)}
                                    </span>
                                  </div>
                                  {item.answer && (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                      <span className="font-medium">
                                        Your answer:
                                      </span>{" "}
                                      {item.answer}
                                    </p>
                                  )}
                                </div>
                                <div
                                  className={cn(
                                    "flex items-center gap-1",
                                    status.color,
                                  )}
                                >
                                  <StatusIcon className="w-5 h-5" />
                                  <span className="font-semibold">
                                    {status.label}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {isExpanded &&
                              (item.explain || item.aiFeedback) && (
                                <div className="px-4 pb-4 pt-0 space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
                                  <div className="h-px bg-border my-2" />

                                  {item.explain && (
                                    <div className="space-y-1.5">
                                      <h4 className="text-sm font-medium flex items-center gap-2 text-orange">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Explanation
                                      </h4>
                                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                                        {item.explain}
                                      </p>
                                    </div>
                                  )}

                                  {item.aiFeedback && (
                                    <div className="space-y-1.5">
                                      <h4 className="text-sm font-medium flex items-center gap-2 text-blue-500">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        AI Feedback
                                      </h4>
                                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                                        {item.aiFeedback}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t shrink-0">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Page</span>
                          <span className="font-semibold text-foreground">
                            {currentPage}
                          </span>
                          <span className="text-muted-foreground">of</span>
                          <span className="font-semibold text-foreground">
                            {totalPages}
                          </span>
                        </div>
                        <div className="h-4 w-px bg-border" />
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Items:
                          </span>
                          <Select
                            value={itemsPerPage.toString()}
                            onValueChange={(value) =>
                              setItemsPerPage(Number(value))
                            }
                          >
                            <SelectTrigger className="h-8 w-[65px] border-2 hover:border-orange/50 transition-colors">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent style={{ zIndex: 150 }}>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={currentPage === 1}
                          className="border-2 hover:border-orange hover:bg-orange/5 disabled:opacity-50"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1),
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="border-2 hover:border-orange hover:bg-orange/5 disabled:opacity-50"
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
