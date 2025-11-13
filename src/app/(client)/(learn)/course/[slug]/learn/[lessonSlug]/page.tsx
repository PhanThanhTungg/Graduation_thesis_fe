import { notFound } from "next/navigation";
import { LessonView } from "./_components";
import { getLessonBySlugForStudent, getLessonChapterTree } from "@/service/lesson.service";
import { getCourseBySlug } from "@/service/course.service";
import { CourseType } from "@/schema/course.schema";
import { CourseCurriculumType, LessonItemType, SectionType } from "@/schema/lesson.schema";

interface PageProps {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
}

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return "0 min";
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) {
    return `${hours}h ${minutes % 60}min`;
  }
  return `${minutes} min`;
}

function hashStringToNumber(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function transformChapterTree(
  chapters: Awaited<ReturnType<typeof getLessonChapterTree>>
): SectionType[] {
  return chapters.map((chapter) => {
    const lessons: LessonItemType[] = chapter.lessons.map((lesson) => ({
      id: hashStringToNumber(lesson.id),
      slug: lesson.slug,
      title: lesson.title,
      duration: formatDuration(lesson.videoLesson?.duration || null),
      type: lesson.videoLesson ? "video" : "reading",
      isPreview: lesson.isFree,
      isCompleted: lesson.progress === "completed",
      videoId: lesson.videoLesson?.videoId,
      embedUrl: lesson.videoLesson?.embedUrl,
      content: lesson.description || undefined,
    }));

    const section: SectionType = {
      id: hashStringToNumber(chapter.id),
      title: chapter.title,
      lessons,
    };

    if (chapter.children && chapter.children.length > 0) {
      section.children = transformChapterTree(chapter.children);
    }

    return section;
  });
}

function countAllLessons(sections: SectionType[]): number {
  let count = 0;
  for (const section of sections) {
    count += section.lessons.length;
    if (section.children) {
      count += countAllLessons(section.children);
    }
  }
  return count;
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

  let course;
  try {
    course = await getCourseBySlug(slug);
  } catch (error) {
    console.error("Failed to fetch course:", error);
    notFound();
  }

  let chapterTree;
  try {
    chapterTree = await getLessonChapterTree(slug);
  } catch (error) {
    console.error("Failed to fetch chapter tree:", error);
    notFound();
  }

  const sections = transformChapterTree(chapterTree);
  const totalLessons = countAllLessons(sections);
  
  function calculateTotalDuration(chapters: Awaited<ReturnType<typeof getLessonChapterTree>>): number {
    let total = 0;
    for (const chapter of chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.videoLesson?.duration) {
          total += lesson.videoLesson.duration;
        }
      }
      if (chapter.children && chapter.children.length > 0) {
        total += calculateTotalDuration(chapter.children);
      }
    }
    return total;
  }
  
  const totalDurationSeconds = calculateTotalDuration(chapterTree);

  const curriculum: CourseCurriculumType = {
    courseId: typeof course.id === "number" ? course.id : parseInt(course.id) || 0,
    sections,
    totalDuration: formatDuration(totalDurationSeconds),
  };

  const currentLesson: LessonItemType = {
    id: hashStringToNumber(lesson.id),
    slug: lesson.slug,
    title: lesson.title,
    duration: formatDuration(lesson.videoLesson?.duration || null),
    type: lesson.videoLesson ? "video" : "reading",
    isPreview: lesson.isFree,
    isCompleted: lesson.progress === "completed",
    videoId: lesson.videoLesson?.videoId,
    embedUrl: lesson.videoLesson?.embedUrl,
    content: lesson.description || undefined,
  };

  const courseData: CourseType = {
    id: typeof course.id === "number" ? course.id : parseInt(course.id) || 0,
    title: course.title,
    courseDescription: course.courseDescription || {
      headline: undefined,
      targetKnowledges: undefined,
      requirements: undefined,
      suitableParticipants: undefined,
      detail: undefined,
    },
    thumbnailUrl: course.thumbnailUrl,
    price: course.price,
    teacher: course.teacher,
    rating: course.rating || 0,
    slug: course.slug,
    isPublished: course.isPublished,
    createdAt: course.createdAt ? new Date(course.createdAt) : undefined,
    updatedAt: new Date(course.updatedAt),
    countStudent: course.countStudent,
  };

  return (
    <LessonView
      course={courseData}
      curriculum={curriculum}
      currentLesson={currentLesson}
    />
  );
}
