import { CourseHero, CourseContent } from "./_components";
import BreadcrumbCustom, {
  BreadcrumbProps,
} from "@/components/custom/breadcrumb";
import NotFound from "@/app/not-found";
import Image from "next/image";
import { getCourseBySlug } from "@/service/course.service";
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
  try {
    const { slug } = await params;
    course = await getCourseBySlug(slug);
  } catch {
    return <NotFound />;
  }

  if (!course) {
    return <NotFound />;
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
