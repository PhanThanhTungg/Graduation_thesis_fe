import { CourseHero, CourseContent } from "./_components";
import BreadcrumbCustom, {
  BreadcrumbProps,
} from "@/components/custom/breadcrumb";
import NotFound from "@/app/not-found";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getCourseBySlug } from "@/service/course.service";
import { getNextLessonByCourseSlug } from "@/service/lesson.service";

interface CourseDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  let course;
  try {
    course = await getCourseBySlug(params.slug);
  } catch {
    return <NotFound />;
  }

  if (!course) {
    return <NotFound />;
  }

  let nextLessonSlug: string | null = null;
  try {
    nextLessonSlug = await getNextLessonByCourseSlug(params.slug);
  } catch {
    nextLessonSlug = null;
  }

  const breadcrumbData: BreadcrumbProps[] = [
    { url: "/", label: "Home" },
    { url: "/courses", label: "Courses" },
    { url: undefined, label: course.title },
  ];

  return (
    <div className="w-full">
      {/* Breadcrumb Section */}
      <BreadcrumbCustom breadcrumb={breadcrumbData} />

      {/* Hero Section */}
      <CourseHero course={course} />

      {/* Main Content */}
      <section className="container-md grid grid-cols-3 gap-4 py-[40px]">
        <section className="col-span-2">
          <CourseContent course={course} />
        </section>
        <section className="sticky top-19 bg-card border rounded-[20px] overflow-hidden h-fit">
          {/* Course Image */}
          <div className="relative w-full h-[250px]">
            <Image
              src={course.thumbnailUrl || "/placeholder-course.jpg"}
              alt={course.title}
              fill
              sizes="410px"
              className="object-cover"
            />
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-center gap-[20px] py-[25px]">
            {/* Price */}
            <span className="text-lg font-semibold">
              ${course.price.toFixed(1)}
            </span>

            {/* CTA Button */}
            <Button
              size="lg"
              className="bg-green hover:bg-green/90 text-secondary text-lg font-bold rounded-3xl px-6"
              asChild
            >
              <Link
                href={
                  nextLessonSlug
                    ? `/course/${course.slug}/learn/${nextLessonSlug}`
                    : `/courses/${course.slug}/purchase`
                }
              >
                Start now
              </Link>
            </Button>
          </div>
        </section>
      </section>
    </div>
  );
}
