"use client"

import { CourseType } from "@/schema/course.schema"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { updateCourseStatus } from "@/service/course.service"
import { showToast } from "@/lib/toast"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

interface TeacherCoursesListProps {
  initialCourses?: CourseType[]
  onCourseUpdated?: () => void
}

export function TeacherCoursesList({ initialCourses = [], onCourseUpdated }: TeacherCoursesListProps) {
  const [courses, setCourses] = useState<CourseType[]>(initialCourses)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    setCourses(initialCourses)
  }, [initialCourses])

  const handleToggleStatus = async (e: React.MouseEvent, course: CourseType) => {
    e.preventDefault()
    e.stopPropagation()
    
    setUpdatingId(course.id)
    try {
      const updatedCourse = await updateCourseStatus(course.id, !course.isPublished)
      setCourses(courses.map(c => c.id === course.id ? updatedCourse : c))
      showToast("success", `Course ${updatedCourse.isPublished ? "published" : "unpublished"} successfully`)
      if (onCourseUpdated) {
        onCourseUpdated()
      }
    } catch (error) {
      showToast("error", "Failed to update course status")
      console.error(error)
    } finally {
      setUpdatingId(null)
    }
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">You haven't created any courses yet.</p>
        <p className="text-sm text-muted-foreground">Click "Create Course" to get started!</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {courses.map((course) => (
        <li key={course.id}>
          <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <Link 
              href={`/courses/${course.slug}`}
              className="flex items-center gap-4 flex-1"
            >
              <div className="relative w-24 h-16 flex-shrink-0">
                <Image
                  src={course.thumbnailUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7g5SvKsiKVcylCXpx4jPGGn3SDgA3vxKx5w&s"}
                  alt={course.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{course.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    course.isPublished 
                      ? 'bg-green/10 text-green' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ${course.price}
                  </span>
                  {course.countStudent !== undefined && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course.countStudent}
                      </span>
                    </>
                  )}
                  {course.rating > 0 && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        ⭐ {course.rating}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleToggleStatus(e, course)}
              disabled={updatingId === course.id}
              className="flex-shrink-0"
            >
              {updatingId === course.id ? (
                "Updating..."
              ) : (
                course.isPublished ? "Unpublish" : "Publish"
              )}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}


