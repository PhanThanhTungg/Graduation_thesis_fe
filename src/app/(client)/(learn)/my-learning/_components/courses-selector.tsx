"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExtendedCourseType } from "@/schema/course.schema";
import { useRouter } from "next/navigation";

interface CoursesSelectorProps {
  courses: ExtendedCourseType[];
  selectedCourseId?: string;
}

export default function CoursesSelector({
  courses,
  selectedCourseId,
}: CoursesSelectorProps) {
  const router = useRouter();

  return (
    <Select
      defaultValue={selectedCourseId}
      onValueChange={(value) => {
        router.push(`/my-learning/notes?courseId=${value}`);
      }}
    >
      <SelectTrigger className="w-full lg:w-1/2">
        <SelectValue placeholder="Select a course" />
      </SelectTrigger>
      <SelectContent>
        {courses.map((course) => (
          <SelectItem key={course.id} value={course.id.toString()}>
            {course.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
