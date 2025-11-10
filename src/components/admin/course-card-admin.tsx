"use client"

import { AdminCourseItemType } from "@/schema/course.schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Star, Calendar, DollarSign, BookOpen, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface CourseCardAdminProps {
  course: AdminCourseItemType;
  onDelete?: (courseId: string) => void;
  isDeleting?: boolean;
}

function formatDate(input: string | number | Date): string {
  const targetDate = input instanceof Date ? input : new Date(input);
  return targetDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

export function CourseCardAdmin({ course, onDelete, isDeleting = false }: CourseCardAdminProps) {
  // Check if course is deleted - handle both null and undefined
  const isDeleted = course.deletedAt !== null && course.deletedAt !== undefined;
  

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && !isDeleted) {
      onDelete(course.id);
    }
  };

  return (
    <Link href={`/admin/course/${course.id}`}>
      <Card className={`group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-border hover:border-violet/40 ${
        isDeleted ? "opacity-60 bg-muted/30" : ""
      }`}>
        <div className="flex flex-col md:flex-row items-stretch gap-0 h-full">
          {/* Thumbnail - Left Side / Top on mobile */}
          <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0 overflow-hidden bg-gradient-to-br from-violet/10 to-mint/10">
            {course.thumbnailUrl ? (
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                fill
                className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                  isDeleted ? "grayscale" : ""
                }`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet/20 via-peach/20 to-mint/20">
                <span className="text-5xl font-bold text-violet/40">
                  {course.title.charAt(0)}
                </span>
              </div>
            )}
            
            {/* Status Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isDeleted ? (
                <Badge className="bg-destructive/90 hover:bg-destructive text-white">
                  ✕ Deleted
                </Badge>
              ) : (
                <Badge 
                  className={`${
                    course.isPublished 
                      ? "bg-green/90 hover:bg-green text-white" 
                      : "bg-orange/90 hover:bg-orange text-white"
                  }`}
                >
                  {course.isPublished ? "✓ Published" : "○ Draft"}
                </Badge>
              )}
            </div>

            {/* Delete Button - Show only if not deleted */}
            {!isDeleted && onDelete && (
              <div className="absolute top-3 right-3">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {isDeleting ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Content - Right Side / Bottom on mobile */}
          <div className="flex-1 p-4 md:p-6 flex flex-col gap-3 md:gap-4">
            {/* Header: Title + Category */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1 w-full">
                <h3 className={`font-bold text-lg md:text-xl line-clamp-2 group-hover:text-violet transition-colors duration-300 mb-2 ${
                  isDeleted ? "line-through text-muted-foreground" : ""
                }`}>
                  {course.title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {course.category && (
                    <div className="inline-flex items-center gap-1.5 bg-mint/30 text-green px-3 py-1 rounded-full text-sm font-medium">
                      <BookOpen className="w-3.5 h-3.5" />
                      {course.category.name}
                    </div>
                  )}
                  {isDeleted && course.deletedAt && (
                    <div className="text-xs text-destructive">
                      Deleted on {formatDate(course.deletedAt)}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Price - Large Display */}
              <div className="text-left sm:text-right">
                <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                  <DollarSign className="w-3 h-3" />
                  <span>Price</span>
                </div>
                <div className={`text-xl md:text-2xl font-bold ${
                  isDeleted ? "text-muted-foreground" : "text-green"
                }`}>
                  {formatPrice(course.price)}
                </div>
              </div>
            </div>

            {/* Teacher Info */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-violet/20 flex items-center justify-center text-violet font-semibold text-sm">
                {course.teacher.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Instructor</div>
                <div className="text-sm font-medium text-foreground">{course.teacher.name}</div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mt-auto pt-3 md:pt-4 border-t border-border">
              <div className="flex items-center gap-4 md:gap-6">
                {/* Students Count */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-green" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Students</div>
                    <div className="text-sm font-semibold text-foreground">{course.countStudent}</div>
                  </div>
                </div>

                {/* Rating - Placeholder */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-star/10 flex items-center justify-center">
                    <Star className="w-4 h-4 text-star fill-star" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                    <div className="text-sm font-semibold text-foreground">N/A</div>
                  </div>
                </div>
              </div>

              {/* Created Date */}
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="w-3.5 h-3.5" />
                <div>
                  <span className="text-xs hidden sm:inline">Created: </span>
                  <span className="font-medium">{formatDate(course.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
