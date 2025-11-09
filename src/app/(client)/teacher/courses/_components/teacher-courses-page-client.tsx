"use client"

import { useRef } from "react"
import { CategoryType } from "@/schema/category.schema"
import { ExtendedCourseType } from "@/schema/course.schema"
import { CreateCourseDialog } from "@/components/teacher/create-course-dialog"
import { TeacherCoursesList } from "./teacher-courses-list"

interface TeacherCoursesPageClientProps {
  categories: CategoryType[]
  initialCourses: ExtendedCourseType[]
  initialPagination?: { page: number; limit: number; total: number; totalPages: number }
}

export function TeacherCoursesPageClient({
  categories,
  initialCourses,
  initialPagination,
}: TeacherCoursesPageClientProps) {
  const addCourseRef = useRef<((course: ExtendedCourseType) => void) | null>(null)

  const handleCourseCreated = (course: ExtendedCourseType) => {
    if (addCourseRef.current) {
      addCourseRef.current(course)
    }
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <section className="w-full px-6 py-8 bg-gradient-to-br from-violet/5 via-background to-mint/5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet to-green bg-clip-text text-transparent">
            My Courses
          </h1>
          <p className="text-muted-foreground mt-1">Manage and track your course content</p>
        </div>
        <CreateCourseDialog 
          categories={categories} 
          onCourseCreated={handleCourseCreated}
        />
      </div>
      <TeacherCoursesList 
        initialCourses={initialCourses}
        initialPagination={initialPagination}
        categories={categories}
        onCourseUpdated={handleRefresh}
        onAddCourseRef={(ref) => { addCourseRef.current = ref }}
      />
    </section>
  )
}

