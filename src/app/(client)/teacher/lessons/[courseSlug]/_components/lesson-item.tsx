"use client"

import { Button } from "@/components/ui/button"
import { LessonItemType } from "@/schema/lesson.schema"
import { 
  PlayCircle, 
  ClipboardList, 
  FileText, 
  BookOpen,
  Pencil,
  Trash2,
  Eye,
  Lock
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface LessonItemProps {
  lesson: LessonItemType
  onEdit: () => void
  onDelete: () => void
}

const lessonTypeConfig = {
  video: { icon: PlayCircle, label: "Video", color: "text-blue-600" },
  quiz: { icon: ClipboardList, label: "Quiz", color: "text-purple-600" },
  assignment: { icon: FileText, label: "Assignment", color: "text-orange" },
  reading: { icon: BookOpen, label: "Reading", color: "text-green" },
}

export function LessonItem({ lesson, onEdit, onDelete }: LessonItemProps) {
  const config = lessonTypeConfig[lesson.type]
  const Icon = config.icon

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors group">
      <div className={`${config.color} flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-sm truncate">{lesson.title}</h4>
          {lesson.isPreview ? (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Preview
            </Badge>
          ) : (
            <Lock className="w-3 h-3 text-muted-foreground" />
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{config.label}</span>
          <span>•</span>
          <span>{lesson.duration}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-8 w-8 p-0"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
