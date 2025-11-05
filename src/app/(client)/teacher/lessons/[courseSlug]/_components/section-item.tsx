"use client"

import { Button } from "@/components/ui/button"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SectionType, LessonItemType } from "@/schema/lesson.schema"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { LessonItem } from "./lesson-item"

interface SectionItemProps {
  section: SectionType
  onEditSection: () => void
  onDeleteSection: () => void
  onAddLesson: () => void
  onEditLesson: (lesson: LessonItemType) => void
  onDeleteLesson: (lessonId: number) => void
}

export function SectionItem({
  section,
  onEditSection,
  onDeleteSection,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
}: SectionItemProps) {
  const totalDuration = section.lessons.reduce((acc, lesson) => {
    const [min, sec] = lesson.duration.split(":").map(Number)
    return acc + min * 60 + sec
  }, 0)

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <AccordionItem value={section.id.toString()} className="border rounded-lg px-4">
      <div className="w-full flex items-center justify-between gap-2 group">
        <AccordionTrigger className="flex-1 hover:no-underline py-4">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex flex-col items-start gap-1">
              <h3 className="font-semibold text-base">{section.title}</h3>
              <p className="text-sm text-muted-foreground">
                {section.lessons.length} {section.lessons.length === 1 ? "lesson" : "lessons"} • {formatDuration(totalDuration)}
              </p>
            </div>
          </div>
        </AccordionTrigger>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onEditSection()
            }}
            className="h-8 w-8 p-0"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDeleteSection()
            }}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <AccordionContent className="pb-4">
        <div className="space-y-2 pt-2">
          {section.lessons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No lessons yet</p>
              <p className="text-xs mt-1">Click the button below to add your first lesson</p>
            </div>
          ) : (
            section.lessons.map((lesson) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                onEdit={() => onEditLesson(lesson)}
                onDelete={() => onDeleteLesson(lesson.id)}
              />
            ))
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onAddLesson}
            className="w-full mt-2 border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lesson
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
