import { CourseType } from "@/schema/course.schema";
import { Clock, User, Users, BookOpen, FileQuestion } from "lucide-react";

interface CourseHeroProps {
  course: CourseType;
}

export default function CourseHero({ course }: CourseHeroProps) {

  return (
    <div className="bg-foreground text-background relative">
      <div className="container-md py-[50px]">
        <div className="relative pr-[440px]">
          {/* Category and Instructor */}
          <div className="flex items-center gap-5 mb-4">
            <div className="bg-muted-foreground text-background px-3 py-1.5 rounded-lg">
              <span className="text-sm font-medium capitalize">
                Photography
              </span>
            </div>
            <p className="text-base text-muted">
              by{" "}
              <span className="text-background">
                {course.teacher.fullName}
              </span>
            </p>
          </div>

          {/* Course Title */}
          <h1 className="text-3xl font-semibold text-background capitalize mb-4 font-heading max-w-full">
            {course.title}
          </h1>

          {/* Course Meta */}
          <div className="flex items-center gap-5 text-sm text-muted">
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>2 Weeks</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4" />
              <span>156 Students</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="size-4" />
              <span>All levels</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="size-4" />
              <span>20 Lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <FileQuestion className="size-4" />
              <span>3 Quizzes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
