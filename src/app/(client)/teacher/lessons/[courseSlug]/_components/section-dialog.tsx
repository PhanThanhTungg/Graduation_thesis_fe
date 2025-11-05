"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  SectionType, 
  CreateSectionBodySchema 
} from "@/schema/lesson.schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"

interface SectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  section?: SectionType
  onSave: (section: Omit<SectionType, "id"> & { id?: number }) => void
  mode: "add" | "edit"
}

type FormData = z.infer<typeof CreateSectionBodySchema>

export function SectionDialog({ 
  open, 
  onOpenChange, 
  section, 
  onSave, 
  mode 
}: SectionDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(CreateSectionBodySchema),
    mode: "onChange",
    defaultValues: {
      title: "",
    },
  })

  useEffect(() => {
    if (open) {
      if (section && mode === "edit") {
        reset({ title: section.title })
      } else {
        reset({ title: "" })
      }
    }
  }, [section, mode, open, reset])

  const onSubmit = (data: FormData) => {
    onSave({
      id: section?.id,
      title: data.title,
      lessons: section?.lessons || [],
    })
    reset()
    onOpenChange(false)
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Section" : "Edit Section"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Create a new section for your course curriculum" 
              : "Update the section title"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="section-title">
                Section Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="section-title"
                placeholder="e.g., Introduction to Course"
                {...register("title")}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="bg-green hover:bg-green/90"
            >
              {mode === "add" ? "Add Section" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
