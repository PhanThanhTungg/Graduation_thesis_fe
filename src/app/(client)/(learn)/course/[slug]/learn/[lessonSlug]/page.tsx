import { notFound } from "next/navigation";
import { LessonView } from "./_components";
import { mockCourses, mockCourseCurriculum } from "@/lib/mockData";

interface PageProps {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { slug, lessonSlug } = await params;
  const lessonIdNum = parseInt(lessonSlug);

  // Find the course
  const course = mockCourses.find((c) => c.slug === slug);
  if (!course) {
    notFound();
  }

  // Find the curriculum
  const curriculum = mockCourseCurriculum.find((c) => c.courseId === course.id);
  if (!curriculum) {
    notFound();
  }

  // Find the lesson
  let currentLesson = null;
  for (const section of curriculum.sections) {
    const lesson = section.lessons.find((l) => l.id === lessonIdNum);
    if (lesson) {
      currentLesson = lesson;
      break;
    }
  }

  if (!currentLesson) {
    notFound();
  }

  return (
    <LessonView
      course={course}
      curriculum={curriculum}
      currentLesson={currentLesson}
    />
  );
}
