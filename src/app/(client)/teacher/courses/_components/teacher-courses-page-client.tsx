"use client"

import { CategoryType } from "@/schema/category.schema"
import { CourseType } from "@/schema/course.schema"
import { CreateCourseDialog } from "@/components/teacher/create-course-dialog"
import { TeacherCoursesList } from "./teacher-courses-list"

interface TeacherCoursesPageClientProps {
  categories: CategoryType[]
  initialCourses: CourseType[]
}

export function TeacherCoursesPageClient({
  categories,
  initialCourses,
}: TeacherCoursesPageClientProps) {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <section className="container-xl py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Courses</h1>
        <CreateCourseDialog 
          categories={categories} 
          onCourseCreated={handleRefresh}
        />
      </div>
      <TeacherCoursesList 
        initialCourses={initialCourses} 
        onCourseUpdated={handleRefresh}
      />
    </section>
  )
}

