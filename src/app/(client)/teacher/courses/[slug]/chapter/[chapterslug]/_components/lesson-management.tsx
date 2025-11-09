"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, ChevronLeft, ChevronRight, Pencil, Trash2, Loader2, Lock, Unlock } from "lucide-react"
import { LessonDialog } from "./lesson-dialog"
import { DeleteConfirmationDialog } from "@/components/custom/delete-confirmation-dialog"
import { createLesson, getLessonsByChapterId, updateLesson, deleteLesson } from "@/service/lesson.service"
import { CreateLessonBodySchema } from "@/schema/lesson.schema"
import { z } from "zod"
import { showToast } from "@/lib/toast"

type LessonType = {
  id: string
  title: string
  description?: string | null
  position: number
  duration?: number | null
  slug: string
  chapterId: string
  isFree?: boolean
  videoLesson?: {
    id: string
    videoId: string
    embedUrl: string
  } | null
  files?: {
    id: string
    fileUrl: string
    fileName: string
    fileSize: number
  }[]
}

interface LessonManagementProps {
  chapterId: string
  courseSlug: string
  chapterSlug: string
}

type FormData = z.infer<typeof CreateLessonBodySchema>

export function LessonManagement({ chapterId, courseSlug, chapterSlug }: LessonManagementProps) {
  const [lessons, setLessons] = useState<LessonType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<LessonType | null>(null)
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [sortField, setSortField] = useState("position")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    loadLessons()
  }, [chapterId, debouncedSearch, sortField, sortOrder, page, limit])

  const loadLessons = async () => {
    try {
      setIsLoading(true)
      const data = await getLessonsByChapterId(chapterId, {
        keySearch: debouncedSearch || undefined,
        sortField,
        sortOrder,
        page,
        limit,
      })
      setLessons(data.items)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Failed to load lessons:", error)
      showToast("error", "Failed to load lessons")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateLesson = async (data: FormData) => {
    try {
      setIsCreating(true)
      
      if (editingLesson) {
        await updateLesson(editingLesson.id, data)
        showToast("success", "Lesson updated successfully")
      } else {
        await createLesson(chapterId, data)
        showToast("success", "Lesson created successfully")
      }
      
      setDialogOpen(false)
      setEditingLesson(null)
      await loadLessons()
    } catch (error) {
      console.error("Failed to save lesson:", error)
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to save lesson"
      )
    } finally {
      setIsCreating(false)
    }
  }

  const handleEditLesson = (lesson: LessonType) => {
    setEditingLesson(lesson)
    setDialogOpen(true)
  }

  const handleAddLesson = () => {
    setEditingLesson(null)
    setDialogOpen(true)
  }

  const handleDeleteClick = (lessonId: string) => {
    setLessonToDelete(lessonId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!lessonToDelete) return

    try {
      setIsDeleting(lessonToDelete)
      await deleteLesson(lessonToDelete)
      
      const updatedLessons = lessons.filter((lesson) => lesson.id !== lessonToDelete)
      setLessons(updatedLessons)
      
      const newTotal = pagination.total - 1
      const newTotalPages = Math.ceil(newTotal / pagination.limit)
      
      setPagination((prev) => ({
        ...prev,
        total: newTotal,
        totalPages: newTotalPages,
      }))
      
      if (updatedLessons.length === 0 && page > 1) {
        setPage((prev) => Math.max(1, prev - 1))
      }
      
      showToast("success", "Lesson deleted successfully")
      setDeleteDialogOpen(false)
      setLessonToDelete(null)
    } catch (error) {
      console.error("Failed to delete lesson:", error)
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to delete lesson"
      )
    } finally {
      setIsDeleting(null)
    }
  }

  const handleLimitChange = (value: string) => {
    setLimit(Number(value))
    setPage(1)
  }

  const handleSortFieldChange = (value: string) => {
    setSortField(value)
    setPage(1)
  }

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value as "asc" | "desc")
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Lessons</h2>
        <Button
          onClick={handleAddLesson}
          className="bg-green hover:bg-green/90"
        >
          <Plus className="w-4 h-4" />
          Add Lesson
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-auto sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Label htmlFor="sort-field" className="text-sm whitespace-nowrap">
            Sort by:
          </Label>
          <Select value={sortField} onValueChange={handleSortFieldChange}>
            <SelectTrigger id="sort-field" className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="position">Position</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={handleSortOrderChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Asc</SelectItem>
              <SelectItem value="desc">Desc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading lessons...
        </div>
      ) : lessons.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border rounded-lg">
          {debouncedSearch ? "No lessons found" : "No lessons yet. Create your first lesson to get started."}
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={`/teacher/courses/${courseSlug}/chapter/${chapterSlug}/lesson/${lesson.slug}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{lesson.title}</h3>
                        {lesson.isFree ? (
                          <Unlock className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      {lesson.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {lesson.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-muted-foreground">
                          Position: {lesson.position}
                        </span>
                        {lesson.videoLesson && (
                          <span className="text-xs text-muted-foreground">
                            Has Video
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        handleEditLesson(lesson)
                      }}
                      disabled={isDeleting === lesson.id}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        handleDeleteClick(lesson.id)
                      }}
                      disabled={isDeleting === lesson.id}
                      className="text-destructive hover:text-destructive"
                    >
                      {isDeleting === lesson.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Label htmlFor="items-per-page" className="text-sm">
                Items per page:
              </Label>
              <Select value={limit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger id="items-per-page" className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      <LessonDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setEditingLesson(null)
          }
        }}
        onSave={handleCreateLesson}
        mode={editingLesson ? "edit" : "add"}
        isLoading={isCreating}
        lesson={editingLesson ? {
          id: editingLesson.id,
          title: editingLesson.title,
          description: editingLesson.description,
          isFree: editingLesson.isFree,
          videoLesson: editingLesson.videoLesson || null,
          files: editingLesson.files || [],
        } : null}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) {
            setLessonToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this lesson? This action cannot be undone."
        isLoading={isDeleting !== null}
      />
    </div>
  )
}
