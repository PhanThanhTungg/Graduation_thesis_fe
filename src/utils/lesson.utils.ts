import { getLessonChapterTree } from "@/service/lesson.service";
import { LessonItemType, SectionType } from "@/schema/lesson.schema";
import { CourseType, ExtendedCourseType } from "@/schema/course.schema";

export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds === 0) return "0 min";
  
  const totalMinutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${hours}h`;
  }
  
  if (totalMinutes === 0 && remainingSeconds > 0) {
    return `${remainingSeconds} sec`;
  }
  
  if (minutes > 0) {
    return `${minutes} min`;
  }
  
  return "0 min";
}

export function hashStringToNumber(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

type ChapterTree = Awaited<ReturnType<typeof getLessonChapterTree>>;

interface TransformResult {
  sections: SectionType[];
  totalLessons: number;
  totalDuration: number;
}

export function transformChapterTreeWithStats(
  chapters: ChapterTree
): TransformResult {
  let totalLessons = 0;
  let totalDuration = 0;

  function transformRecursive(chapterList: ChapterTree): SectionType[] {
    return chapterList.map((chapter) => {
      const lessons: LessonItemType[] = chapter.lessons.map((lesson) => {
        totalLessons++;
        const duration = lesson.videoLesson?.duration || 0;
        totalDuration += duration;

        return {
          id: hashStringToNumber(lesson.id),
          slug: lesson.slug,
          title: lesson.title,
          duration: formatDuration(duration),
          type: lesson.videoLesson ? "video" : "reading",
          isPreview: lesson.isFree,
          isCompleted: lesson.progress === "completed",
          progress: lesson.progress,
          videoId: lesson.videoLesson?.videoId,
          embedUrl: lesson.videoLesson?.embedUrl,
          content: lesson.description || undefined,
        };
      });

      const section: SectionType = {
        id: hashStringToNumber(chapter.id),
        title: chapter.title,
        lessons,
      };

      if (chapter.children && chapter.children.length > 0) {
        section.children = transformRecursive(chapter.children);
      }

      return section;
    });
  }

  const sections = transformRecursive(chapters);

  return {
    sections,
    totalLessons,
    totalDuration,
  };
}

export function transformLessonToLessonItem(
  lesson: {
    id: string;
    slug: string;
    title: string;
    description?: string | null;
    isFree: boolean;
    progress: "not_started" | "in_progress" | "completed";
    videoLesson?: {
      videoId: string;
      embedUrl: string;
      duration: number | null;
    } | null;
  }
): LessonItemType {
  return {
    id: hashStringToNumber(lesson.id),
    slug: lesson.slug,
    title: lesson.title,
    duration: formatDuration(lesson.videoLesson?.duration || null),
    type: lesson.videoLesson ? "video" : "reading",
    isPreview: lesson.isFree,
    isCompleted: lesson.progress === "completed",
    progress: lesson.progress,
    videoId: lesson.videoLesson?.videoId,
    embedUrl: lesson.videoLesson?.embedUrl,
    content: lesson.description || undefined,
  };
}

export function transformCourseToCourseType(course: ExtendedCourseType): CourseType {
  return {
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
}

