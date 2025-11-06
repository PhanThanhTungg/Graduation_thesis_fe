import { Metadata } from "next";
import { getAllCategories } from "@/service/category.service";
import { getMyCourses } from "@/service/course.service";
import { ExtendedCourseType } from "@/schema/course.schema";
import { TeacherCoursesPageClient } from "./_components/teacher-courses-page-client";

export const metadata: Metadata = {
  title: "My Courses - Teacher Space",
  description: "Manage your courses",
};

export default async function CoursesPage() {
  const categories = await getAllCategories();
  let courses: ExtendedCourseType[] = [];
  
  try {
    // TODO: Update getMyCourses to return ExtendedCourseType with countStudent and category
    const rawCourses = await getMyCourses();
    // For now, cast to ExtendedCourseType (you'll need to update the API response)
    courses = rawCourses as ExtendedCourseType[];
  } catch (error) {
    console.error("Failed to fetch courses:", error);
  }

  return (
    <TeacherCoursesPageClient 
      categories={categories} 
      initialCourses={courses} 
    />
  );
}

