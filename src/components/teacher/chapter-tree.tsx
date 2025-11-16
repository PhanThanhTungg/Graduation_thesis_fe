"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { IconPlus, IconFolder, IconFolderOpen, IconChevronRight, IconChevronDown, IconTrash, IconEdit } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChapterTreeItemType } from "@/schema/chapter.schema"
import { CreateChapterSchema } from "@/schema/chapter.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { showToast } from "@/lib/toast"
import { getChapterTreeBySlug, createChapterBySlug, deleteChapterBySlug, updateChapterById } from "@/service/course.service"
import { cn } from "@/lib/utils"
import { DeleteConfirmationDialog } from "@/components/custom/delete-confirmation-dialog"

type CreateChapterFormValues = z.infer<typeof CreateChapterSchema>

interface ChapterTreeProps {
  courseSlug: string
  courseId: string
}

interface ChapterNodeProps {
  chapter: ChapterTreeItemType
  level: number
  courseSlug: string
  onAddSubChapter: (parentId: string) => void
  onDeleteChapter: (chapterId: string) => void
  onEditChapter: (chapter: ChapterTreeItemType) => void
}

function ChapterNode({ chapter, level, courseSlug, onAddSubChapter, onDeleteChapter, onEditChapter }: ChapterNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const hasChildren = chapter.children && chapter.children.length > 0

  const handleDelete = () => {
    onDeleteChapter(chapter.id)
    setIsDeleteDialogOpen(false)
  }

  const handleEdit = () => {
    onEditChapter(chapter)
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-2 px-3 rounded-md hover:bg-muted/50 transition-colors",
          level > 0 && "ml-6"
        )}
        style={{ paddingLeft: `${level * 1.5}rem` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors"
          >
            {isExpanded ? (
              <IconChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <IconChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-6" />
        )}
        <Link
          href={`/teacher/courses/${courseSlug}/chapter/${chapter.slug}`}
          className="flex items-center gap-1 flex-1 text-left min-w-0 hover:opacity-80 transition-opacity"
        >
          {isExpanded ? (
            <IconFolderOpen className="h-4 w-4 text-primary flex-shrink-0" />
          ) : (
            <IconFolder className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
          <span className="font-medium truncate">{chapter.title}</span>
          {chapter.description && (
            <span className="text-sm text-muted-foreground truncate ml-2">
              - {chapter.description}
            </span>
          )}
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            handleEdit()
          }}
          className="flex-shrink-0"
        >
          <IconEdit className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setIsDeleteDialogOpen(true)
          }}
          className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <IconTrash className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onAddSubChapter(chapter.id)}
          className="flex-shrink-0"
        >
          <IconPlus className="h-4 w-4" />
        </Button>
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDelete}
          message={`Are you sure you want to delete "${chapter.title}"? This action cannot be undone and will also delete all sub-chapters.`}
        />
      </div>
      {hasChildren && isExpanded && (
        <div>
          {chapter.children.map((child) => (
            <ChapterNode
              key={child.id}
              chapter={child}
              level={level + 1}
              courseSlug={courseSlug}
              onAddSubChapter={onAddSubChapter}
              onDeleteChapter={onDeleteChapter}
              onEditChapter={onEditChapter}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function ChapterTree({ courseSlug, courseId }: ChapterTreeProps) {
  const [chapters, setChapters] = useState<ChapterTreeItemType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [parentId, setParentId] = useState<string | undefined>(undefined)
  const [editingChapter, setEditingChapter] = useState<ChapterTreeItemType | null>(null)

  const form = useForm<CreateChapterFormValues>({
    resolver: zodResolver(CreateChapterSchema),
    defaultValues: {
      title: "",
      description: "",
      parentId: undefined,
    },
  })

  const fetchChapters = async () => {
    setIsLoading(true)
    try {
      const data = await getChapterTreeBySlug(courseSlug)
      setChapters(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load chapters"
      showToast("error", errorMessage)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const memoizedFetchChapters = useCallback(() => {
    fetchChapters()
  }, [courseSlug])

  useEffect(() => {
    memoizedFetchChapters()
  }, [memoizedFetchChapters])

  const handleAddChapter = (parentId?: string) => {
    setParentId(parentId)
    form.reset({
      title: "",
      description: "",
      parentId: parentId,
    })
    setIsDialogOpen(true)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setParentId(undefined)
      form.reset({
        title: "",
        description: "",
        parentId: undefined,
      })
    }
  }

  const onSubmit = async (data: CreateChapterFormValues) => {
    setIsSubmitting(true)
    try {
      await createChapterBySlug(courseSlug, {
        title: data.title,
        description: data.description,
        parentId: data.parentId,
      })
      showToast("success", "Chapter created successfully!")
      handleDialogOpenChange(false)
      fetchChapters()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create chapter"
      showToast("error", errorMessage)
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditChapter = (chapter: ChapterTreeItemType) => {
    setEditingChapter(chapter)
    form.reset({
      title: chapter.title,
      description: chapter.description || "",
      parentId: undefined,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditDialogOpenChange = (open: boolean) => {
    setIsEditDialogOpen(open)
    if (!open) {
      setEditingChapter(null)
      form.reset({
        title: "",
        description: "",
        parentId: undefined,
      })
    }
  }

  const onEditSubmit = async (data: CreateChapterFormValues) => {
    if (!editingChapter) return

    setIsSubmitting(true)
    try {
      await updateChapterById(courseId, editingChapter.id, {
        title: data.title,
        description: data.description,
      })
      showToast("success", "Chapter updated successfully!")
      handleEditDialogOpenChange(false)
      fetchChapters()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update chapter"
      showToast("error", errorMessage)
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteChapter = async (chapterId: string) => {
    try {
      await deleteChapterBySlug(courseSlug, chapterId)
      showToast("success", "Chapter deleted successfully!")
      fetchChapters()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete chapter"
      showToast("error", errorMessage)
      console.error(error)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Chapters</CardTitle>
            <CardDescription>
              Manage your course chapters structure
            </CardDescription>
          </div>
            <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button type="button" onClick={() => handleAddChapter()}>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add Chapter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {parentId ? "Add Sub-Chapter" : "Add New Chapter"}
                  </DialogTitle>
                  <DialogDescription>
                    {parentId
                      ? "Create a new sub-chapter under the selected chapter"
                      : "Create a new root chapter for your course"}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chapter Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Introduction to React"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description of this chapter..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleDialogOpenChange(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Chapter"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogOpenChange}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Chapter</DialogTitle>
                  <DialogDescription>
                    Update chapter information
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chapter Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Introduction to React"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description of this chapter..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleEditDialogOpenChange(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Chapter"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading chapters...
          </div>
        ) : chapters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <IconFolder className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No chapters yet. Create your first chapter to get started.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {chapters.map((chapter) => (
              <ChapterNode
                key={chapter.id}
                chapter={chapter}
                level={0}
                courseSlug={courseSlug}
                onAddSubChapter={handleAddChapter}
                onDeleteChapter={handleDeleteChapter}
                onEditChapter={handleEditChapter}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

