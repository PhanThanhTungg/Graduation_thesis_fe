"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateCourseForm } from "./create-course-form"
import { CategoryType } from "@/schema/category.schema"
import { Plus } from "lucide-react"

interface CreateCourseDialogProps {
  categories: CategoryType[]
  onCourseCreated?: () => void
}

export function CreateCourseDialog({
  categories,
  onCourseCreated,
}: CreateCourseDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
    if (onCourseCreated) {
      onCourseCreated()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[90vw] w-[60vw] max-h-[95vh] flex flex-col p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Create New Course</DialogTitle>
          <DialogDescription className="text-base">
            Fill in the details below to create a new course
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 -mx-8 px-8">
          <CreateCourseForm categories={categories} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

