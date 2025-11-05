"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Accordion } from "@/components/ui/accordion"
import { SectionType, LessonItemType } from "@/schema/lesson.schema"
import { Plus } from "lucide-react"
import { SectionItem } from "./section-item"
import { SectionDialog } from "./section-dialog"
import { LessonDialog } from "./lesson-dialog"

interface LessonManagementProps {
  initialSections: SectionType[]
  courseTitle: string
}

export function LessonManagement({ initialSections, courseTitle }: LessonManagementProps) {
  const [sections, setSections] = useState<SectionType[]>(initialSections)
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false)
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<SectionType | undefined>()
  const [editingLesson, setEditingLesson] = useState<{ 
    sectionId: number
    lesson?: LessonItemType 
  } | undefined>()
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")

  const handleAddSection = () => {
    setEditingSection(undefined)
    setDialogMode("add")
    setSectionDialogOpen(true)
  }

  const handleEditSection = (section: SectionType) => {
    setEditingSection(section)
    setDialogMode("edit")
    setSectionDialogOpen(true)
  }

  const handleDeleteSection = (sectionId: number) => {
    if (confirm("Are you sure you want to delete this section? All lessons in this section will be removed.")) {
      setSections(sections.filter(s => s.id !== sectionId))
    }
  }

  const handleSaveSection = (sectionData: Omit<SectionType, "id"> & { id?: number }) => {
    if (dialogMode === "add") {
      const newSection: SectionType = {
        id: Date.now(),
        title: sectionData.title,
        lessons: [],
      }
      setSections([...sections, newSection])
    } else if (sectionData.id) {
      setSections(sections.map(s => 
        s.id === sectionData.id 
          ? { ...s, title: sectionData.title }
          : s
      ))
    }
  }

  const handleAddLesson = (sectionId: number) => {
    setEditingLesson({ sectionId })
    setDialogMode("add")
    setLessonDialogOpen(true)
  }

  const handleEditLesson = (sectionId: number, lesson: LessonItemType) => {
    setEditingLesson({ sectionId, lesson })
    setDialogMode("edit")
    setLessonDialogOpen(true)
  }

  const handleDeleteLesson = (sectionId: number, lessonId: number) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      setSections(sections.map(section => 
        section.id === sectionId
          ? {
              ...section,
              lessons: section.lessons.filter(l => l.id !== lessonId)
            }
          : section
      ))
    }
  }

  const handleSaveLesson = (lessonData: Omit<LessonItemType, "id" | "isCompleted" | "duration"> & { id?: number, duration?: string, videoUrl?: string | File }) => {
    if (!editingLesson) return

    if (dialogMode === "add") {
      const videoUrl = lessonData.videoUrl instanceof File 
        ? URL.createObjectURL(lessonData.videoUrl)
        : lessonData.videoUrl

      const newLesson: LessonItemType = {
        id: Date.now(),
        title: lessonData.title,
        duration: lessonData.duration || "00:00",
        type: lessonData.type,
        isPreview: lessonData.isPreview,
        isCompleted: false,
        videoUrl: typeof videoUrl === "string" ? videoUrl : undefined,
        content: lessonData.content,
      }

      setSections(sections.map(section => 
        section.id === editingLesson.sectionId
          ? {
              ...section,
              lessons: [...section.lessons, newLesson]
            }
          : section
      ))
    } else if (lessonData.id) {
      const videoUrl = lessonData.videoUrl instanceof File 
        ? URL.createObjectURL(lessonData.videoUrl)
        : lessonData.videoUrl

      setSections(sections.map(section => 
        section.id === editingLesson.sectionId
          ? {
              ...section,
              lessons: section.lessons.map(l => 
                l.id === lessonData.id
                  ? { 
                      ...l,
                      title: lessonData.title,
                      type: lessonData.type,
                      isPreview: lessonData.isPreview,
                      videoUrl: typeof videoUrl === "string" ? videoUrl : l.videoUrl,
                      content: lessonData.content,
                    }
                  : l
              )
            }
          : section
      ))
    }
  }

  const totalLessons = sections.reduce((acc, section) => acc + section.lessons.length, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">Manage Lessons</h1>
          <p className="text-muted-foreground mt-1">{courseTitle}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {sections.length} {sections.length === 1 ? "section" : "sections"} • {totalLessons} {totalLessons === 1 ? "lesson" : "lessons"}
          </p>
        </div>
        <Button onClick={handleAddSection} className="bg-green hover:bg-green/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Section
        </Button>
      </div>

      {sections.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2">No sections yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first section to organize your course content
            </p>
            <Button onClick={handleAddSection} className="bg-green hover:bg-green/90">
              <Plus className="w-4 h-4 mr-2" />
              Create First Section
            </Button>
          </div>
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {sections.map((section) => (
            <SectionItem
              key={section.id}
              section={section}
              onEditSection={() => handleEditSection(section)}
              onDeleteSection={() => handleDeleteSection(section.id)}
              onAddLesson={() => handleAddLesson(section.id)}
              onEditLesson={(lesson) => handleEditLesson(section.id, lesson)}
              onDeleteLesson={(lessonId) => handleDeleteLesson(section.id, lessonId)}
            />
          ))}
        </Accordion>
      )}

      <SectionDialog
        open={sectionDialogOpen}
        onOpenChange={setSectionDialogOpen}
        section={editingSection}
        onSave={handleSaveSection}
        mode={dialogMode}
      />

      <LessonDialog
        open={lessonDialogOpen}
        onOpenChange={setLessonDialogOpen}
        lesson={editingLesson?.lesson}
        onSave={handleSaveLesson}
        mode={dialogMode}
      />
    </div>
  )
}
