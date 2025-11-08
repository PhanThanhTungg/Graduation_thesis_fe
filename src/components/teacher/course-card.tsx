import { ExtendedCourseType } from "@/schema/course.schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
      <Card className="group overflow-hidden hover:shadow-xl hover:shadow-violet/10 transition-all duration-300 cursor-pointer h-full flex flex-col border-violet/20 hover:border-violet/40">
        {/* Thumbnail */}
        <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-violet/10 to-mint/10">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet/20 via-peach/20 to-mint/20">
              <span className="text-5xl font-bold text-violet/40">
                {course.title.charAt(0)}
              </span>
            </div>
          )}
          
          {/* Category Badge */}
          {course.category && (
            <Badge className="absolute top-2 left-2 bg-green/90 hover:bg-green">
              {course.category.title}
            </Badge>
          )}
        </div>

        <CardHeader className="pb-3">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-violet transition-colors duration-300">
            {course.title}
          </h3>
        </CardHeader>

        <CardContent className="flex-1 pb-3">
          {course.courseDescription?.headline && (
            <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors">
              {course.courseDescription.headline}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-3 border-t border-violet/10">
          {/* Stats Row */}
          <div className="flex items-center justify-between w-full text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-green font-medium group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
                <span>{course.countStudent}</span>
              </div>
              
              <div className="flex items-center gap-1 text-star group-hover:scale-105 transition-transform">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-foreground font-medium">{course.rating}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(course.updatedAt)}</span>
            </div>
          </div>

          {/* Price and Status Row */}
          <div className="flex items-center justify-between w-full">
            <span className="text-2xl font-bold text-primary">
              ${course.price}
            </span>
            
            <div className="flex items-center gap-2">
              {onTogglePublish && (
                <div className="flex items-center gap-2" onClick={handlePublishToggle}>
                  <Button
                    variant={course.isPublished ? "default" : "outline"}
                    size="sm"
                    disabled={isUpdating}
                    className={course.isPublished 
                      ? "h-7 text-xs bg-green hover:bg-green/90 text-white border-0 shadow-sm" 
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
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
