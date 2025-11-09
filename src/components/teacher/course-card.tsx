import { ExtendedCourseType } from "@/schema/course.schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Star, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  course: ExtendedCourseType;
  onTogglePublish?: (courseId: number, isPublished: boolean) => void;
  isUpdating?: boolean;
}

function formatTimeAgo(input: string | number | Date): string {
  const targetDate = input instanceof Date ? input : new Date(input);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

export function CourseCard({ course, onTogglePublish, isUpdating = false }: CourseCardProps) {
  const handlePublishToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onTogglePublish) {
      onTogglePublish(course.id, !course.isPublished);
    }
  };

  return (
    <Link href={`/teacher/courses/${course.slug}`}>
      <Card className="group p-0 overflow-hidden hover:shadow-xl hover:shadow-violet/10 transition-all duration-300 cursor-pointer border-violet/20 hover:border-violet/40">
        <div className="flex items-center gap-4 p-4">
          {/* Thumbnail */}
          <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-violet/10 to-mint/10">
            {course.thumbnailUrl ? (
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet/20 via-peach/20 to-mint/20">
                <span className="text-3xl font-bold text-violet/40">
                  {course.title.charAt(0)}
                </span>
              </div>
            )}
            
            {/* Category Badge */}
            {course.category && (
              <Badge className="absolute top-1 left-1 bg-green/90 hover:bg-green text-xs">
                {course.category.title}
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col gap-2 min-w-0 relative">
            {/* Published button ở góc phải trên */}
            <div className="absolute top-0 right-0">
              {onTogglePublish && (
                <div className="flex items-center gap-2" onClick={handlePublishToggle}>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUpdating}
                    className={course.isPublished 
                      ? "h-7 text-xs border-green text-green hover:bg-green/10 hover:border-green" 
                      : "h-7 text-xs border-orange/50 text-orange hover:bg-orange/10 hover:border-orange"}
                  >
                    {isUpdating ? "⏳" : course.isPublished ? "✓ Published" : "○ Publish"}
                  </Button>
                </div>
              )}
              {!onTogglePublish && (
                <Badge 
                  variant="outline" 
                  className={course.countStudent > 500 
                    ? "font-normal border-orange/50 text-orange bg-orange/5" 
                    : "font-normal border-mint/50 text-green bg-mint/20"}>
                  {course.countStudent > 500 ? "🔥 Best Seller" : "✨ New"}
                </Badge>
              )}
            </div>

            {/* Title và Headline */}
            <div className="pr-32">
              <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-violet transition-colors duration-300">
                {course.title}
              </h3>
              {course.courseDescription?.headline && (
                <p className="text-sm text-muted-foreground line-clamp-1 group-hover:text-foreground/80 transition-colors mt-1">
                  {course.courseDescription.headline}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="mt-auto">
              <span className="text-xl font-bold text-primary">
                ${course.price}
              </span>
            </div>

            {/* Stats ở góc phải dưới */}
            <div className="absolute bottom-0 right-0 flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-green font-medium">
                <Users className="w-4 h-4" />
                <span>{course.countStudent}</span>
              </div>
              
              <div className="flex items-center gap-1 text-star">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-foreground font-medium">{course.rating}</span>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(course.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
