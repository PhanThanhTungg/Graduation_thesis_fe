import { CourseType } from "@/schema/course.schema";
import { BookOpen, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import WishlistButton from "./wishlist-button";

export default function CourseCard({ course }: { course: CourseType }) {
  return (
    <Link href={`/courses/${course.slug}`} className="group">
      <div className="bg-card border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Course Image */}
        <div className="relative w-full aspect-video">
          <Image
            src={course.thumbnailUrl || "/placeholder-course.jpg"}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 33vw, 22vw"
            className="object-cover w-full"
          />
          <div className="absolute top-2 left-2 bg-green px-2 py-1 flex items-center gap-1 rounded-sm">
            <BookOpen className="size-4 text-primary-foreground" />
            <span className="text-primary-foreground text-xs font-medium">
              {course.category.title}
            </span>
          </div>
          <WishlistButton course={course} />
        </div>

        {/* Course Content */}
        <div className="py-2 px-4 space-y-2">
          <div className="text-sm text-muted-foreground">
            <span>by </span>
            <span className="font-semibold">{course.teacher.fullName}</span>
          </div>

          <h3 className="font-semibold text-lg truncate group-hover:text-green transition-colors">
            {course.title}
          </h3>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-start gap-1 text-sm text-star">
              <Star className="size-4 fill-star" />
              <span className="font-medium">{course.rating}</span>
            </div>
            <div className="text-lg font-bold text-green">${course.price}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
