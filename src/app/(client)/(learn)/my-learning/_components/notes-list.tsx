import Link from "next/link";
import { GetNotesByCourseResponseType } from "@/schema/note.schema";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { formatTimeMinute } from "@/lib/helpers";

interface NotesListProps {
  notes: GetNotesByCourseResponseType["data"]["lessons"];
  courseSlug: string;
}

export default function NotesList({ notes, courseSlug }: NotesListProps) {
  if (!notes || notes.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        <p className="text-lg font-semibold">
          You have no notes for this course.
        </p>
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="w-full">
      {notes.map((lesson) => (
        <AccordionItem key={lesson.lessonId} value={lesson.lessonId}>
          <AccordionTrigger className="px-4">
            <div className="flex items-center justify-between w-full">
              <div>
                <Link
                  href={`/course/${courseSlug}/learn/${lesson.lessonSlug}`}
                  className="text-base font-semibold hover:underline"
                >
                  {lesson.lessonTitle}
                </Link>
                <div className="text-sm text-muted-foreground">
                  {lesson.notes.length}{" "}
                  {lesson.notes.length === 1 ? "note" : "notes"}
                </div>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-4">
            <div className="flex flex-col gap-3">
              {lesson.notes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-start gap-4 p-3 rounded-md border border-border bg-background"
                >
                  <div className="shrink-0 text-sm bg-orange px-2 py-1 rounded-sm">
                    {formatTimeMinute(note.timestamp)}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-foreground">{note.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
