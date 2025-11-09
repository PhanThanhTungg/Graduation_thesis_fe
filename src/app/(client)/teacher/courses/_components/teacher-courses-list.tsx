"use client"

import { ExtendedCourseType } from "@/schema/course.schema"
import { CategoryType } from "@/schema/category.schema"
import { useEffect, useState } from "react"
import { CourseCard } from "@/components/teacher/course-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { mockTeacherCourses } from "@/lib/mockData"
import { updateCourseById, deleteCourse } from "@/service/course.service"
import { showToast } from "@/lib/toast"

interface TeacherCoursesListProps {
  initialCourses?: ExtendedCourseType[]
  categories?: CategoryType[]
  onCourseUpdated?: () => void
  onAddCourseRef?: (ref: (course: ExtendedCourseType) => void) => void
}

export function TeacherCoursesList({ initialCourses = [], categories, onCourseUpdated, onAddCourseRef }: TeacherCoursesListProps) {
  // Use mock data for now if no initial courses
  const [courses, setCourses] = useState<ExtendedCourseType[]>(
    initialCourses.length > 0 ? initialCourses : mockTeacherCourses
  )
  const [filteredCourses, setFilteredCourses] = useState<ExtendedCourseType[]>(courses)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const itemsPerPage = 6

  useEffect(() => {
    if (initialCourses.length > 0) {
      setCourses(initialCourses)
    }
  }, [initialCourses])

  useEffect(() => {
    if (onAddCourseRef) {
      const addCourse = (course: ExtendedCourseType) => {
        setCourses(prevCourses => [course, ...prevCourses])
      }
      onAddCourseRef(addCourse)
    }
  }, [onAddCourseRef])

  // Filter and sort courses
  useEffect(() => {
    let result = [...courses]

    // Search filter
    if (searchQuery) {
      result = result.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.courseDescription?.headline?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "students":
        result.sort((a, b) => (b.countStudent || 0) - (a.countStudent || 0))
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
    }

    setFilteredCourses(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [courses, searchQuery, sortBy])

  const handleTogglePublish = async (courseId: number, newStatus: boolean) => {
    setUpdatingId(courseId)
    
    try {
      const updatedCourse = await updateCourseById(String(courseId), {
        isPublished: newStatus,
      })
      
      setCourses(prevCourses => 
        prevCourses.map(c => 
          c.id === courseId ? updatedCourse : c
        )
      )
      
      showToast(
        "success",
        newStatus 
          ? "Course published successfully!" 
          : "Course unpublished successfully!"
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update course status"
      showToast("error", errorMessage)
      console.error(error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleCourseUpdated = (updatedCourse: ExtendedCourseType) => {
    setCourses(prevCourses => 
      prevCourses.map(c => 
        c.id === updatedCourse.id ? updatedCourse : c
      )
    )
  }

  const handleCourseDeleted = async (courseId: number) => {
    setDeletingId(courseId)
    
    try {
      await deleteCourse(String(courseId))
      
      setCourses(prevCourses => 
        prevCourses.filter(c => c.id !== courseId)
      )
      
      showToast("success", "Course deleted successfully!")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete course"
      showToast("error", errorMessage)
      console.error(error)
    } finally {
      setDeletingId(null)
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCourses = filteredCourses.slice(startIndex, endIndex)

  if (courses.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-violet/5 via-peach/5 to-mint/10 rounded-2xl border-2 border-dashed border-violet/30">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-lg font-medium text-foreground mb-2">No courses yet</p>
        <p className="text-sm text-muted-foreground">Click "Create Course" button to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border border-violet/20 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet w-4 h-4" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-violet/30 focus:border-violet focus:ring-violet/20"
          />
        </div>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[200px] border-violet/30 focus:border-violet focus:ring-violet/20">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="students">Most Students</SelectItem>
            <SelectItem value="rating">Highest Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-green">
          {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
        </span>
        <span className="text-muted-foreground">
          • Showing {startIndex + 1}-{Math.min(endIndex, filteredCourses.length)}
        </span>
      </div>

      {/* Course List - Vertical Layout */}
      {currentCourses.length > 0 ? (
        <ul className="space-y-2">
          {currentCourses.map((course) => (
            <li key={course.id}>
              <CourseCard
                course={course}
                categories={categories}
                onTogglePublish={handleTogglePublish}
                onCourseUpdated={handleCourseUpdated}
                onCourseDeleted={handleCourseDeleted}
                isUpdating={updatingId === course.id}
                isDeleting={deletingId === course.id}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg border-2 border-dashed border-orange/30">
          <p className="text-muted-foreground text-lg">🔍 No courses found matching your search.</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 p-4 bg-card rounded-lg border border-mint/20">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="border-green/30 hover:bg-green/10 hover:text-green hover:border-green disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page 
                  ? "w-10 bg-green hover:bg-green/90 text-white border-green" 
                  : "w-10 border-green/30 hover:bg-green/10 hover:text-green hover:border-green"}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="border-green/30 hover:bg-green/10 hover:text-green hover:border-green disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

