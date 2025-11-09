import { Metadata } from "next";
import { getAllCategories } from "@/service/category.service";
import { getMyCourses } from "@/service/course.service";
import { ExtendedCourseType } from "@/schema/course.schema";
import { TeacherCoursesPageClient } from "./_components/teacher-courses-page-client";
import BreadcrumbCustom, { BreadcrumbProps } from "@/components/custom/breadcrumb";

export const metadata: Metadata = {
  title: "My Courses - Teacher Space",
  description: "Manage your courses",
};

export default async function CoursesPage() {
  const categories = await getAllCategories();
  let courses: ExtendedCourseType[] = [];

  try {
    const rawCourses = await getMyCourses();
    courses = rawCourses as ExtendedCourseType[];
  } catch (error) {
    console.error("Failed to fetch courses:", error);
  }

  const breadcrumbData: BreadcrumbProps[] = [
    { url: "/teacher", label: "Teacher" },
    { url: "/teacher/courses", label: "Courses" },
  ];

  return (
    <>
      <BreadcrumbCustom breadcrumb={breadcrumbData} />
      <div className="container-sm">
        <TeacherCoursesPageClient
          categories={categories}
          initialCourses={courses}
        />
      </div>
    </>
  );
}

