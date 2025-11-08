import { Metadata } from "next";
import { getCourseById, getMyCourses, getChapterTreeById } from "@/service/course.service";
import { notFound } from "next/navigation";
import BreadcrumbCustom, { BreadcrumbProps } from "@/components/custom/breadcrumb";
import { ChapterTreeItemType } from "@/schema/chapter.schema";
import { LessonManagement } from "./_components/lesson-management";

interface ChapterDetailPageProps {
  params: Promise<{
    courseslug: string;
    chapterslug: string;
  }>;
}

export const metadata: Metadata = {
  title: "Chapter Detail - Teacher Space",
  description: "View and edit chapter details",
};

function findChapterBySlug(chapters: ChapterTreeItemType[], slug: string): ChapterTreeItemType | null {
  for (const chapter of chapters) {
    if (chapter.slug === slug) {
      return chapter;
    }
    if (chapter.children && chapter.children.length > 0) {
      const found = findChapterBySlug(chapter.children, slug);
      if (found) return found;
    }
  }
  return null;
}

export default async function ChapterDetailPage({ params }: ChapterDetailPageProps) {
  const { courseslug, chapterslug } = await params;

  let course;
  try {
    const myCourses = await getMyCourses();
    const found = myCourses.find((c) => c.slug === courseslug);
    if (!found) {
      notFound();
    }
    course = await getCourseById(String(found!.id));
  } catch (error) {
    console.error("Failed to fetch course:", error);
    notFound();
  }

  if (!course) {
    notFound();
  }

  let chapterTitle = "Chapter";
  let chapterId: string | null = null;
  try {
    const chapters = await getChapterTreeById(String(course.id));
    const chapter = findChapterBySlug(chapters, chapterslug);
    if (chapter) {
      chapterTitle = chapter.title;
      chapterId = chapter.id;
    }
  } catch (error) {
    console.error("Failed to fetch chapters:", error);
  }

  const breadcrumbData: BreadcrumbProps[] = [
    { url: "/teacher", label: "Teacher" },
    { url: "/teacher/courses", label: "Courses" },
    { url: `/teacher/courses/${course.slug}`, label: course.title },
    { url: undefined, label: chapterTitle },
  ];

  return (
    <>
      <BreadcrumbCustom breadcrumb={breadcrumbData} />
      <section className="w-full px-6 py-8 bg-gradient-to-br from-violet/5 via-background to-mint/5">
        <div className="container-md space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet to-green bg-clip-text text-transparent">
              Chapter Details
            </h1>
            <p className="text-muted-foreground mt-1">Manage your chapter information</p>
          </div>
          {chapterId && (
            <LessonManagement chapterId={chapterId} courseSlug={courseslug} chapterSlug={chapterslug} />
          )}
        </div>
      </section>
    </>
  );
}

