import { mockCourseCurriculum, mockCourseDetail } from "@/lib/mockData";
import { CourseHero, CourseContent } from "./_components";
import BreadcrumbCustom, { BreadcrumbProps } from "@/components/custom/breadcrumb";
import NotFound from "@/app/not-found";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface CourseDetailPageProps {
  params: {
    slug: string;
  };
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  // Find course by slug
  const course = mockCourseDetail;

  if (!course) {
    return <NotFound />
  }

  const curriculum = mockCourseCurriculum.find((c) => c.courseId === course.id);
  const firstLesson = curriculum?.sections[0]?.lessons[0];
  const firstLessonUrl = firstLesson
    ? `/course/${course.slug}/learn/${firstLesson.id}`
    : `/courses/${course.slug}`;

  const breadcrumbData: BreadcrumbProps[] = [
    { url: "/", label: "Home" },
    { url: "/courses", label: "Courses" },
    { url: undefined, label: course.title },
  ]

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
              <Link href={firstLessonUrl}>Start now</Link>
            </Button>
          </div>
        </section>
      </section>
    </div>
  );
}
