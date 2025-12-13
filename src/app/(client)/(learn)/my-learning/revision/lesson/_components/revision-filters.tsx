"use client";

import { LessonReviewStatus } from "@/schema/review-space.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface RevisionFiltersProps {
  courses: { id: string; title: string }[];
  selectedStatus: LessonReviewStatus | "all";
  selectedCourse: string;
  selectedReviewStep: string;
  onStatusChange: (status: LessonReviewStatus | "all") => void;
  onCourseChange: (courseId: string) => void;
  onReviewStepChange: (step: string) => void;
  onClearFilters: () => void;
}

const statusOptions: { value: LessonReviewStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "new", label: "New" },
  { value: "learning", label: "Learning" },
  { value: "reviewing", label: "Reviewing" },
  { value: "lapsed", label: "Lapsed" },
  { value: "suspending", label: "Suspended" },
];

const reviewStepOptions = [
  { value: "all", label: "All Steps" },
  { value: "1", label: "Step 1" },
  { value: "2", label: "Step 2" },
  { value: "3", label: "Step 3" },
  { value: "4", label: "Step 4" },
  { value: "5+", label: "Step 5+" },
];

export default function RevisionFilters({
  courses,
  selectedStatus,
  selectedCourse,
  selectedReviewStep,
  onStatusChange,
  onCourseChange,
  onReviewStepChange,
  onClearFilters,
}: RevisionFiltersProps) {
  const hasActiveFilters =
    selectedStatus !== "all" ||
    selectedCourse !== "all" ||
    selectedReviewStep !== "all";

  return (
    <div className="flex flex-wrap gap-2 items-center mb-6">
      <div className="">
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="">
        <Select value={selectedCourse} onValueChange={onCourseChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="">
        <Select value={selectedReviewStep} onValueChange={onReviewStepChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by review step" />
          </SelectTrigger>
          <SelectContent>
            {reviewStepOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="gap-2"
        >
          <X className="size-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
