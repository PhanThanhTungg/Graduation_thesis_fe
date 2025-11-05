import { mockCourseCurriculum, mockCourses } from "@/lib/mockData";
import { Metadata } from "next";
import { LessonManagement } from "./_components";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Manage Lesson - Teacher Space",
  description: "Manage lessons for your selected course",
}

export default async function TeacherCourseLessonsPage({
  params,
}: {
  params: { courseSlug: string }
}) {
  const { courseSlug } = params;
  const course = mockCourses.find(c => c.slug === courseSlug);
  
  if (!course) {
    notFound();
  }

  const courseCurriculum = mockCourseCurriculum[0].sections;

  return (
    <section className="container-lg py-8">
      <LessonManagement 
        initialSections={courseCurriculum} 
        courseTitle={course.title}
      />
    </section>
  )
}