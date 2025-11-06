import { ExtendedCourseType } from "@/schema/course.schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Star, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  course: ExtendedCourseType;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/teacher/courses/${course.slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative w-full h-48 overflow-hidden bg-muted">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="text-4xl font-bold text-primary/30">
                {course.title.charAt(0)}
              </span>
            </div>
          )}
          
          {/* Category Badge */}
          {course.category && (
            <Badge className="absolute top-2 left-2 bg-primary/90 hover:bg-primary">
              {course.category.title}
            </Badge>
          )}
        </div>

        <CardHeader className="pb-3">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
        </CardHeader>

        <CardContent className="flex-1 pb-3">
          {course.courseDescription?.headline && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {course.courseDescription.headline}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-3 border-t">
          {/* Stats Row */}
          <div className="flex items-center justify-between w-full text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{course.countStudent}</span>
              </div>
              
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-foreground font-medium">{course.rating}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(course.updatedAt)}</span>
            </div>
          </div>

          {/* Price Row */}
          <div className="flex items-center justify-between w-full">
            <span className="text-2xl font-bold text-primary">
              ${course.price}
            </span>
            
            <Badge variant="outline" className="font-normal">
              {course.countStudent > 500 ? "Best Seller" : "New"}
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
