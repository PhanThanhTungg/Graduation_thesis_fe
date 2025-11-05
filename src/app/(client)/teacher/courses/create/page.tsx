import { Metadata } from "next"
import { getAllCategories } from "@/service/category.service"
import { CreateCourseForm } from "@/components/teacher/create-course-form"

export const metadata: Metadata = {
  title: "Create Course - Teacher Space",
  description: "Create a new course in the Teacher Space",
}

export default async function CreateCoursePage() {
  // Fetch categories on the server
  const categories = await getAllCategories()

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Course</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details below to create a new course
        </p>
      </div>

      <CreateCourseForm categories={categories} />
    </div>
  )
}
