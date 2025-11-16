import { notFound } from "next/navigation";
import { LessonView } from "./_components";
import { getLessonBySlugForStudent, getLessonChapterTree } from "@/service/lesson.service";
import { getCourseBySlug } from "@/service/course.service";
import { CourseCurriculumType } from "@/schema/lesson.schema";
import {
  transformChapterTreeWithStats,
  transformLessonToLessonItem,
  transformCourseToCourseType,
  formatDuration,
} from "../../../../../../../utils/lesson.utils";

interface PageProps {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { slug, lessonSlug } = await params;

  let lesson;
  try {
    lesson = await getLessonBySlugForStudent(lessonSlug);
  } catch (error) {
    console.error("Failed to fetch lesson:", error);
    notFound();
  }

  if (lesson.chapter.course.slug !== slug) {
    notFound();
  }

  const [course, chapterTree] = await Promise.all([
    getCourseBySlug(slug).catch((error) => {
      console.error("Failed to fetch course:", error);
      notFound();
    }),
    getLessonChapterTree(slug).catch((error) => {
      console.error("Failed to fetch chapter tree:", error);
      notFound();
    }),
  ]);

  const { sections, totalLessons, totalDuration } = transformChapterTreeWithStats(chapterTree);

  const curriculum: CourseCurriculumType = {
    courseId: typeof course?.id === "number" ? course?.id : parseInt(course?.id || "0") || 0,
    sections,
    totalDuration: formatDuration(totalDuration),
    totalLessons,
  };

  const currentLesson = transformLessonToLessonItem(lesson);
  const courseData = transformCourseToCourseType(course!);

  return (
    <LessonView
      course={courseData}
      curriculum={curriculum}
      currentLesson={currentLesson}
    />
  );
}
