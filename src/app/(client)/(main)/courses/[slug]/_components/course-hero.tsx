import { ExtendedCourseType } from "@/schema/course.schema";
import { Clock, User, Users, BookOpen, FileQuestion } from "lucide-react";

interface CourseHeroProps {
  course: ExtendedCourseType;
}

export default function CourseHero({ course }: CourseHeroProps) {

  return (
    <section className="bg-green-foreground relative">
      <div className="container-md py-[50px]">
        <div className="relative pr-[440px]">
          {/* Category and Instructor */}
          <div className="flex items-center gap-5 mb-4">
            <div className="bg-primary text-secondary px-3 py-1.5 rounded-lg">
              <span className="text-sm font-medium capitalize">
                {course.category.title || "Uncategorized"}
              </span>
            </div>
            <p>
              by{" "}
              <span>
                {course.teacher.fullName}
              </span>
            </p>
          </div>

          {/* Course Title */}
          <h1 className="text-3xl font-semibold capitalize font-heading max-w-full">
            {course.title}
          </h1>
          <p className="mb-4 text-muted-foreground">{course.courseDescription.headline}</p>

          {/* Course Meta */}
          <div className="flex items-center gap-5 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-green" />
              <span>2 Weeks</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-green" />
              <span>{course.countStudent} Students</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="size-4 text-green" />
              <span>All levels</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-green" />
              <span>20 Lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <FileQuestion className="size-4 text-green" />
              <span>3 Quizzes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
