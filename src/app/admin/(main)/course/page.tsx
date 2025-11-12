import { ListCourses } from "./listCourses";
import { BookOpen } from "lucide-react";

export default function CoursePage() {
  return (
     <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-violet/10 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-violet" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Courses Management</h1>
          <p className="text-sm text-muted-foreground">Manage all courses in the system</p>
        </div>
      </div>
      <ListCourses />
    </div>
  )
}
