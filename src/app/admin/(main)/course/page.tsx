import { ListCourses } from "./listCourses";
import { BookOpen, AlertCircle } from "lucide-react";
import { hasServerPermission } from "@/lib/server-permission";

export default async function CoursePage() {
  const hasAccess = await hasServerPermission("course", "view");

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold">Access Denied</h3>
          <p className="text-muted-foreground">
            You do not have permission to view this content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-violet/10 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-violet" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Courses Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage all courses in the system
          </p>
        </div>
      </div>
      <ListCourses />
    </div>
  );
}
