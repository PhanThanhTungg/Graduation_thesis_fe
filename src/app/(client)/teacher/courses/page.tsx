import { Metadata } from "next";
import { getAllCategories } from "@/service/category.service";
import { getMyCourses } from "@/service/course.service";
import { CourseType } from "@/schema/course.schema";
import { TeacherCoursesPageClient } from "./_components/teacher-courses-page-client";

export const metadata: Metadata = {
  title: "My Courses - Teacher Space",
  description: "Manage your courses",
};

export default async function CoursesPage() {
  const categories = await getAllCategories();
  let courses: CourseType[] = [];
  
  try {
    courses = await getMyCourses();
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

