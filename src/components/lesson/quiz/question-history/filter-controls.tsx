import { useMemo } from "react";
import { ArrowUpDown, CheckCircle2, XCircle } from "lucide-react";
import {
  TypeQuestion,
  Difficulty,
  QUESTION_TYPE_LABELS,
  DIFFICULTY_LABELS,
} from "@/service/question.service";
import { FilterSelect } from "./filter-select";
import { FilterHeader } from "./filter-header";
import { DIFFICULTY_COLOR_MAP } from "./constants";

export type SortOption = "date-desc" | "date-asc" | "score-desc" | "score-asc";

interface FilterControlsProps {
  filterType: string;
  filterDifficulty: string;
  sortBy: SortOption;
  onFilterTypeChange: (value: string) => void;
  onFilterDifficultyChange: (value: string) => void;
  onSortByChange: (value: SortOption) => void;
  onReset: () => void;
}

export function FilterControls({
  filterType,
  filterDifficulty,
  sortBy,
  onFilterTypeChange,
  onFilterDifficultyChange,
  onSortByChange,
  onReset,
}: FilterControlsProps) {
  const hasActiveFilters =
    filterType !== "all" ||
    filterDifficulty !== "all" ||
    sortBy !== "date-desc";

  const typeOptions = useMemo(
    () => [
      { value: "all", label: "All Types", color: "bg-orange opacity-70" },
      ...Object.values(TypeQuestion).map((type) => ({
        value: type,
        label: QUESTION_TYPE_LABELS[type],
        color: "bg-orange",
      })),
    ],
    [],
  );

  const difficultyOptions = useMemo(
    () => [
      { value: "all", label: "All Levels", color: "bg-blue-500" },
      ...Object.values(Difficulty).map((level) => ({
        value: level,
        label: DIFFICULTY_LABELS[level],
        color: DIFFICULTY_COLOR_MAP[level],
      })),
    ],
    [],
  );

  const sortOptions = useMemo(
    () => [
      {
        value: "date-desc",
        label: "Newest First",
        icon: <ArrowUpDown className="w-3 h-3" />,
      },
      {
        value: "date-asc",
        label: "Oldest First",
        icon: <ArrowUpDown className="w-3 h-3 rotate-180" />,
      },
      {
        value: "score-desc",
        label: "Highest Score",
        icon: <CheckCircle2 className="w-3 h-3 text-green-500" />,
      },
      {
        value: "score-asc",
        label: "Lowest Score",
        icon: <XCircle className="w-3 h-3 text-red-500" />,
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-3 shrink-0">
      <FilterHeader hasActiveFilters={hasActiveFilters} onReset={onReset} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <FilterSelect
          label="Question Type"
          value={filterType}
          onValueChange={onFilterTypeChange}
          placeholder="Select type..."
          options={typeOptions}
        />

        <FilterSelect
          label="Difficulty Level"
          value={filterDifficulty}
          onValueChange={onFilterDifficultyChange}
          placeholder="Select difficulty..."
          options={difficultyOptions}
        />

        <FilterSelect
          label="Sort By"
          value={sortBy}
          onValueChange={(value) => onSortByChange(value as SortOption)}
          placeholder="Select sorting..."
          options={sortOptions}
        />
      </div>
    </div>
  );
}
