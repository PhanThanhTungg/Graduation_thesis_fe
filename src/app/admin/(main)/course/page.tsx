import { ListCourses } from "./listCourses";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CoursePage() {
  return (
     <>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">Courses</h1>
        <Link href="/admin/courses/create" className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
          <Plus className="w-4 h-4" />
          Add Course
        </Link>
      </div>
      <ListCourses />
    </>
  )
}
