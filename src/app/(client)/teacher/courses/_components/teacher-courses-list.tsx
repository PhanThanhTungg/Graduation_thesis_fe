"use client"

import { ExtendedCourseType } from "@/schema/course.schema"
import { CategoryType } from "@/schema/category.schema"
import { useEffect, useState } from "react"
import { CourseCard } from "@/components/teacher/course-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { updateCourseById, deleteCourse, getMyCourses } from "@/service/course.service"
import { showToast } from "@/lib/toast"

interface TeacherCoursesListProps {
  initialCourses?: ExtendedCourseType[]
  initialPagination?: { page: number; limit: number; total: number; totalPages: number }
  categories?: CategoryType[]
  onCourseUpdated?: () => void
  onAddCourseRef?: (ref: (course: ExtendedCourseType) => void) => void
}

export function TeacherCoursesList({ 
  initialCourses = [], 
  initialPagination,
  categories, 
  onCourseUpdated, 
  onAddCourseRef 
}: TeacherCoursesListProps) {
  const [courses, setCourses] = useState<ExtendedCourseType[]>(initialCourses)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [publishFilter, setPublishFilter] = useState<"all" | "published" | "unpublished">("all")
  const [currentPage, setCurrentPage] = useState(initialPagination?.page || 1)
  const [itemsPerPage, setItemsPerPage] = useState(initialPagination?.limit || 6)
  const [pagination, setPagination] = useState(initialPagination)
  const [isLoading, setIsLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    if (initialCourses.length > 0) {
      setCourses(initialCourses)
    }
    if (initialPagination) {
      setPagination(initialPagination)
      setCurrentPage(initialPagination.page)
      setItemsPerPage(initialPagination.limit)
    }
  }, [initialCourses, initialPagination])

  useEffect(() => {
    if (onAddCourseRef) {
      const addCourse = (course: ExtendedCourseType) => {
        setCourses(prevCourses => [course, ...prevCourses])
        if (pagination) {
          setPagination({
            ...pagination,
            total: pagination.total + 1,
            totalPages: Math.ceil((pagination.total + 1) / pagination.limit)
          })
        }
      }
      onAddCourseRef(addCourse)
    }
  }, [onAddCourseRef, pagination])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const getSortParams = (sortBy: string) => {
    switch (sortBy) {
      case "newest":
        return { sortField: "createdAt", sortOrder: "desc" as const }
      case "oldest":
        return { sortField: "createdAt", sortOrder: "asc" as const }
      case "price-high":
        return { sortField: "price", sortOrder: "desc" as const }
      case "price-low":
        return { sortField: "price", sortOrder: "asc" as const }
      case "students":
        return { sortField: "countStudent", sortOrder: "desc" as const }
      case "rating":
        return { sortField: "rating", sortOrder: "desc" as const }
      default:
        return { sortField: "createdAt", sortOrder: "desc" as const }
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchQuery, sortBy, itemsPerPage, publishFilter])

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true)
      try {
        const sortParams = getSortParams(sortBy)
        const isPublished = publishFilter === "all" 
          ? undefined 
          : publishFilter === "published"
        const result = await getMyCourses({
          keySearch: debouncedSearchQuery || undefined,
          ...sortParams,
          page: currentPage,
          limit: itemsPerPage,
          isPublished,
        })
        setCourses(result.courses)
        if (result.pagination) {
          setPagination(result.pagination)
        }
      } catch (error) {
        showToast("error", "Failed to load courses")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [debouncedSearchQuery, sortBy, currentPage, itemsPerPage, publishFilter])

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
      
      if (pagination) {
        setPagination({
          ...pagination,
          total: pagination.total - 1,
          totalPages: Math.ceil((pagination.total - 1) / pagination.limit)
        })
      }
      
      showToast("success", "Course deleted successfully!")
      
      if (courses.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete course"
      showToast("error", errorMessage)
      console.error(error)
    } finally {
      setDeletingId(null)
    }
  }

  const totalPages = pagination?.totalPages || 1
  const total = pagination?.total || 0
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, total)

  return (
    <div className="space-y-6">
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
        
        <Select value={publishFilter} onValueChange={(value) => setPublishFilter(value as "all" | "published" | "unpublished")}>
          <SelectTrigger className="w-full sm:w-[180px] border-violet/30 focus:border-violet focus:ring-violet/20">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="unpublished">Unpublished</SelectItem>
          </SelectContent>
        </Select>

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

        <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
          <SelectTrigger className="w-full sm:w-[150px] border-violet/30 focus:border-violet focus:ring-violet/20">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 per page</SelectItem>
            <SelectItem value="6">6 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="15">15 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-green">
          {total} {total === 1 ? 'course' : 'courses'}
        </span>
        {total > 0 && (
          <span className="text-muted-foreground">
            • Showing {startIndex + 1}-{endIndex}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      ) : courses.length > 0 ? (
        <ul className="space-y-2">
          {courses.map((course) => (
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
        <div className="text-center py-16 bg-gradient-to-br from-violet/5 via-peach/5 to-mint/10 rounded-2xl border-2 border-dashed border-violet/30">
          {!debouncedSearchQuery && publishFilter === "all" && sortBy === "newest" ? (
            <>
              <div className="text-6xl mb-4">📚</div>
              <p className="text-lg font-medium text-foreground mb-2">No courses yet</p>
              <p className="text-sm text-muted-foreground">Click "Create Course" button to get started!</p>
            </>
          ) : (
            <>
              <p className="text-muted-foreground text-lg">🔍 No courses found matching your search.</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
            </>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 p-4 bg-card rounded-lg border border-mint/20">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || isLoading}
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
                disabled={isLoading}
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
            disabled={currentPage === totalPages || isLoading}
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
