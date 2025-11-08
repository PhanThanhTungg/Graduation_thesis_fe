import { Metadata } from "next"
import { getAllCategories } from "@/service/category.service"
import { CreateCourseForm } from "@/components/teacher/create-course-form"
import BreadcrumbCustom, { BreadcrumbProps } from "@/components/custom/breadcrumb"

export const metadata: Metadata = {
  title: "Create Course - Teacher Space",
  description: "Create a new course in the Teacher Space",
}

export default async function CreateCoursePage() {
  const categories = await getAllCategories()

  const breadcrumbData: BreadcrumbProps[] = [
    { url: "/teacher", label: "Teacher" },
    { url: "/teacher/courses", label: "Courses" },
    { url: undefined, label: "Create Course" },
  ];

  return (
    <>
      <BreadcrumbCustom breadcrumb={breadcrumbData} />
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Course</h1>
          <p className="text-muted-foreground mt-2">
            Fill in the details below to create a new course
          </p>
        </div>

        <CreateCourseForm categories={categories} />
      </div>
    </>
  )
}
