import { getMyLearning } from "@/service/course.service";
import { Metadata } from "next";
import CoursesSelector from "../_components/courses-selector";
import { getNotesByCourseId } from "@/service/note.service";
import NotesList from "../_components/notes-list";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "My Notes",
  description: "Your personal notes in Aikabis Learning Platform",
};

interface NotesPageProps {
  searchParams: Promise<{
    courseId: string | undefined;
  }>;
}
export default async function NotesPage({ searchParams }: NotesPageProps) {
  const params = await searchParams;
  const courseId = params.courseId || undefined;
  const [coursesData, notesData] = await Promise.all([
    getMyLearning(),
    getNotesByCourseId(courseId),
  ]);
  const courses = coursesData.courses;

  if (courses.length === 0) {
    return (
      <section className="container-md">
        <div className="mb-3">
          <h1 className="text-2xl font-bold mb-2">My Notes</h1>
          <p className="text-muted-foreground text-sm">
            Your personal notes in Aikabis Learning Platform
          </p>
        </div>
        <div className="py-10 text-center text-muted-foreground">
          <p className="text-lg font-semibold">
            You have no courses in your learning list.
          </p>
        </div>
      </section>
    );
  }

  const selectedCourseSlug =
    courses.find((course) => course.id.toString() === courseId)?.slug || "";

  return (
    <section className="container-md">
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-2">My Notes</h1>
        <p className="text-muted-foreground text-sm">
          Your personal notes in Aikabis Learning Platform
        </p>
      </div>

      <Label className="mb-1">Course</Label>
      <CoursesSelector courses={courses} selectedCourseId={courseId} />
      {courseId ? (
        <>
          <NotesList notes={notesData} courseSlug={selectedCourseSlug} />
        </>
      ) : (
        <div className="py-10 text-center text-muted-foreground">
          <p className="text-lg font-semibold">
            Please select a course to view your notes.
          </p>
        </div>
      )}
    </section>
  );
}
