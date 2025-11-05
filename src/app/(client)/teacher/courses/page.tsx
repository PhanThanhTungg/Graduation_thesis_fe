import { Metadata } from "next";
import { getAllCategories } from "@/service/category.service";
import { CreateCourseDialog } from "@/components/teacher/create-course-dialog";

export const metadata: Metadata = {
  title: "My Courses - Teacher Space",
  description: "Manage your courses",
};

export default async function CoursesPage() {
  const categories = await getAllCategories();

  return (
    <section className="container-xl py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Courses</h1>
        <CreateCourseDialog categories={categories} />
      </div>
      <div className="text-muted-foreground">
        Your courses will appear here
      </div>
    </section>
  );
}

