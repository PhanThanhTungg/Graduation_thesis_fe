import { Metadata } from "next";
import { getAllCategories } from "@/service/category.service";
import { getCourseBySlugTeacherArea } from "@/service/course.service";
import { EditCourseInfo } from "@/components/teacher/edit-course-info";
import { ChapterTree } from "@/components/teacher/chapter-tree";
import NotFound from "@/app/not-found";
import { notFound } from "next/navigation";
import BreadcrumbCustom, { BreadcrumbProps } from "@/components/custom/breadcrumb";

interface CourseDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const metadata: Metadata = {
  title: "Course Detail - Teacher Space",
  description: "View and edit course details",
};

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const categories = await getAllCategories();
  
  let course;
  try {
    course = await getCourseBySlugTeacherArea(slug);
  } catch (error) {
    console.error("Failed to fetch course:", error);
    notFound();
  }

  if (!course) {
    notFound();
  }

  const breadcrumbData: BreadcrumbProps[] = [
    { url: "/teacher", label: "Teacher" },
    { url: "/teacher/courses", label: "Courses" },
    { url: undefined, label: course.title },
  ];

  return (
    <>
      <BreadcrumbCustom breadcrumb={breadcrumbData} />
      <section className="w-full px-6 py-8 bg-gradient-to-br from-violet/5 via-background to-mint/5">
        <div className="container-sm space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet to-green bg-clip-text text-transparent">
              Course Details
            </h1>
            <p className="text-muted-foreground mt-1">Manage your course information</p>
          </div>
          <EditCourseInfo course={course} categories={categories} />
          <ChapterTree courseSlug={course.slug} />
        </div>
      </section>
    </>
  );
}
