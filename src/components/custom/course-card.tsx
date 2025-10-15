import { CourseType } from "@/schema/course.schema";
import { BookOpen, Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CourseCard({ course }: { course: CourseType }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group"
    >
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
        </div>

        {/* Course Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 text-sm text-green bg-green/5 px-2 py-1 rounded">
              <BookOpen className="size-3" />
              Development
            </span>
          </div>

          <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-green transition-colors">
            {course.title}
          </h3>

          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <User className="size-4" />
            <span>{course.teacher.fullName}</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-start gap-1 text-sm text-star">
              <Star className="size-4 fill-star" />
              <span className="font-medium">{course.rating}</span>
            </div>
            <div className="text-lg font-bold text-green">
              ${course.price}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}