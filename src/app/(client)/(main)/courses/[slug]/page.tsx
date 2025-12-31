import { CourseHero, CourseContent } from "./_components";
import BreadcrumbCustom, {
  BreadcrumbProps,
} from "@/components/custom/breadcrumb";
import NotFound from "@/app/not-found";
import Image from "next/image";
import { getCourseBySlug } from "@/service/course.service";
import { getLessonChapterTree } from "@/service/lesson.service";
import { CourseCurriculumType } from "@/schema/lesson.schema";
import {
  formatDuration,
  transformChapterTreeWithStats,
} from "@/utils/lesson.utils";
import CourseActionButton from "./_components/course-action-button";

interface CourseDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  let course;
  let curriculum: CourseCurriculumType | null = null;

  try {
    const { slug } = await params;

    const [courseData, chapterTree] = await Promise.all([
      getCourseBySlug(slug),
      getLessonChapterTree(slug),
    ]);

    course = courseData;

    if (courseData && chapterTree) {
      const { sections, totalLessons, totalDuration } =
        transformChapterTreeWithStats(chapterTree);

      curriculum = {
        courseId:
          typeof courseData.id === "number"
            ? courseData.id
            : parseInt(courseData.id as unknown as string) || 0,
        sections,
        totalDuration: formatDuration(totalDuration),
        totalLessons,
      };
    }
  } catch {
    return <NotFound />;
  }

  if (!course || !curriculum) {
    return <NotFound />;
  }

  const breadcrumbData: BreadcrumbProps[] = [
    { url: "/", label: "Home" },
    { url: "/courses", label: "Courses" },
    { url: undefined, label: course.title },
  ];

  return (
    <div className="w-full">
      <BreadcrumbCustom breadcrumb={breadcrumbData} />

      <CourseHero course={course} />

      <section className="container-md grid grid-cols-3 gap-4 py-[40px]">
        <section className="col-span-2">
          <CourseContent course={course} curriculum={curriculum} />
        </section>
        <section className="sticky top-19 bg-card border rounded-[20px] overflow-hidden h-fit">
          <div className="relative w-full h-[250px]">
            <Image
              src={course.thumbnailUrl || "/placeholder-course.jpg"}
              alt={course.title}
              fill
              sizes="410px"
              className="object-cover"
            />
          </div>

          <div className="flex items-center justify-center gap-[20px] py-[25px]">
            <span className="text-lg font-semibold">
              ${course.price.toFixed(1)}
            </span>

            <CourseActionButton
              courseId={course.id + ""}
              courseSlug={course.slug}
            />
          </div>
        </section>
      </section>
    </div>
  );
}
