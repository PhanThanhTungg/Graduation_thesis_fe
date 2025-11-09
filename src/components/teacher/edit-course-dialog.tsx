"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EditCourseForm } from "./edit-course-form"
import { CategoryType } from "@/schema/category.schema"
import { ExtendedCourseType } from "@/schema/course.schema"
import { Pencil } from "lucide-react"

interface EditCourseDialogProps {
  course: ExtendedCourseType
  categories: CategoryType[]
  onCourseUpdated?: (course: ExtendedCourseType) => void
}

export function EditCourseDialog({
  course,
  categories,
  onCourseUpdated,
}: EditCourseDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = (updatedCourse: ExtendedCourseType) => {
    setOpen(false)
    if (onCourseUpdated) {
      onCourseUpdated(updatedCourse)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
        className="h-7 text-xs border-violet/50 text-violet hover:bg-violet/10 hover:border-violet"
      >
        <Pencil className="w-3 h-3" />
      </Button>
      <DialogContent 
        className="!max-w-[90vw] w-[60vw] max-h-[95vh] flex flex-col p-8"
        onClick={(e) => {
          e.stopPropagation()
        }}
        onPointerDown={(e) => {
          e.stopPropagation()
        }}
      >
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Edit Course</DialogTitle>
          <DialogDescription className="text-base">
            Update the details of your course
          </DialogDescription>
        </DialogHeader>
        <div 
          className="overflow-y-auto flex-1 -mx-8 px-8"
          onClick={(e) => {
            e.stopPropagation()
          }}
          onPointerDown={(e) => {
            e.stopPropagation()
          }}
        >
          {open && (
            <EditCourseForm 
              key={`${course.id}-${open}`}
              course={course} 
              categories={categories} 
              onSuccess={handleSuccess} 
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

