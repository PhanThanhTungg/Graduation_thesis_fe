"use client"

import { useState, useEffect } from "react"
import { getAllCoursesAdmin, AdminCourseFilters, deleteCourseAdmin } from "@/service/admin/course.service"
import { AdminCourseItemType } from "@/schema/course.schema"
import { CourseCardAdmin } from "@/components/admin/course-card-admin"
import { DeleteConfirmationDialog } from "@/components/custom/delete-confirmation-dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, ArrowUpDown, Loader2 } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { toast } from "sonner"

export function ListCourses() {
  const [courses, setCourses] = useState<AdminCourseItemType[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [sortField, setSortField] = useState<string>("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [publishFilter, setPublishFilter] = useState<string>("all")
  const [includeDeleted, setIncludeDeleted] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setCurrentPage(1) // Reset to page 1 when search changes
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true)
      try {
        const filters: AdminCourseFilters = {
          keySearch: debouncedSearchQuery || undefined,
          sortField,
          sortOrder,
          page: currentPage,
          limit: itemsPerPage,
          includeDeleted,
        }

        // Add publish filter
        if (publishFilter === "published") {
          filters.isPublished = true
        } else if (publishFilter === "draft") {
          filters.isPublished = false
        }

        const result = await getAllCoursesAdmin(filters)

        if (result) {
          setCourses(result.items)
          setTotalPages(result.pagination.totalPages)
          setTotalItems(result.pagination.total)
        } else {
          setCourses([])
          setTotalPages(1)
          setTotalItems(0)
        }
      } catch (error) {
        console.error("Error fetching courses:", error)
        setCourses([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [debouncedSearchQuery, sortField, sortOrder, publishFilter, currentPage, itemsPerPage, includeDeleted])

  // Handle delete course
  const handleDeleteClick = (courseId: string) => {
    setCourseToDelete(courseId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return

    setDeletingId(courseToDelete)
    try {
      await deleteCourseAdmin(courseToDelete)
      toast.success("Course deleted successfully")
      
      // Refresh the courses list
      const filters: AdminCourseFilters = {
        keySearch: debouncedSearchQuery || undefined,
        sortField,
        sortOrder,
        page: currentPage,
        limit: itemsPerPage,
        includeDeleted,
      }

      if (publishFilter === "published") {
        filters.isPublished = true
      } else if (publishFilter === "draft") {
        filters.isPublished = false
      }

      const result = await getAllCoursesAdmin(filters)
      if (result) {
        setCourses(result.items)
        setTotalPages(result.pagination.totalPages)
        setTotalItems(result.pagination.total)
      }
    } catch (error) {
      console.error("Error deleting course:", error)
      toast.error("Failed to delete course")
    } finally {
      setDeletingId(null)
      setCourseToDelete(null)
    }
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Get visible page numbers
  const getVisiblePages = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={publishFilter} onValueChange={setPublishFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

        {/* Sort */}
        <Select 
          value={`${sortField}-${sortOrder}`} 
          onValueChange={(value) => {
            const [field, order] = value.split("-")
            setSortField(field)
            setSortOrder(order as "asc" | "desc")
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            <SelectItem value="price-desc">Price (High-Low)</SelectItem>
            <SelectItem value="price-asc">Price (Low-High)</SelectItem>
            <SelectItem value="countStudent-desc">Most Students</SelectItem>
            <SelectItem value="countStudent-asc">Least Students</SelectItem>
          </SelectContent>
        </Select>

          {/* Items per page */}
          <Select value={String(itemsPerPage)} onValueChange={(value) => {
            setItemsPerPage(Number(value))
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 / page</SelectItem>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="20">20 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Include Deleted Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeDeleted"
            checked={includeDeleted}
            onCheckedChange={(checked) => {
              setIncludeDeleted(checked as boolean)
              setCurrentPage(1)
            }}
          />
          <label
            htmlFor="includeDeleted"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Show deleted courses
          </label>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing <span className="font-semibold text-foreground">{courses.length}</span> of{" "}
          <span className="font-semibold text-foreground">{totalItems}</span> courses
        </div>
        <div>
          Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
          <span className="font-semibold text-foreground">{totalPages}</span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-violet" />
        </div>
      )}

      {/* Courses List */}
      {!isLoading && courses.length > 0 && (
        <div className="space-y-4">
          {courses.map((course) => (
            <CourseCardAdmin 
              key={course.id} 
              course={course}
              onDelete={handleDeleteClick}
              isDeleting={deletingId === course.id}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this course? This action will mark the course as deleted."
        isLoading={deletingId !== null}
      />

      {/* Empty State */}
      {!isLoading && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No courses found</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {debouncedSearchQuery
              ? `No courses match "${debouncedSearchQuery}". Try adjusting your search or filters.`
              : "No courses available. Create your first course to get started."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && courses.length > 0 && totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {getVisiblePages().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <span className="px-4 py-2">...</span>
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
