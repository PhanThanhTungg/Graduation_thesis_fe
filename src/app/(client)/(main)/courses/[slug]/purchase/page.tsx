import BreadcrumbCustom, {
  BreadcrumbProps,
} from "@/components/custom/breadcrumb";
import NotFound from "@/app/not-found";
import { getCourseBySlug } from "@/service/course.service";
import { getNextLessonByCourseSlug } from "@/service/lesson.service";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import CheckoutClient from "./_components/checkout-client";

interface PurchasePageProps {
  params: {
    slug: string;
  };
}

export default async function PurchasePage({ params }: PurchasePageProps) {
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
    { url: `/courses/${course.slug}`, label: course.title },
    { url: undefined, label: "Checkout" },
  ];

  return (
    <div className="w-full">
      <BreadcrumbCustom breadcrumb={breadcrumbData} />
      <section className="container-lg py-[40px] grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <article className="space-y-6">
          <header className="space-y-3">
            <p className="text-sm uppercase text-muted-foreground tracking-wide">
              Secure checkout
            </p>
            <h1 className="text-3xl font-semibold text-foreground font-heading">
              Complete your access to {course.title}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Review the course information, apply a voucher if you have one,
              and finish your purchase through PayPal.
            </p>
          </header>
          <section className="rounded-[20px] border bg-card p-6 space-y-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative h-[140px] w-full overflow-hidden rounded-xl md:w-[200px]">
                <Image
                  src={course.thumbnailUrl || "/placeholder-course.jpg"}
                  alt={course.title}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  {course.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {course.courseDescription?.headline ||
                    course.courseDescription?.detail ||
                    "Level up your skills with this course."}
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-medium">Base price:</span>
                  <span className="text-green font-semibold">
                    {formatPrice(course.price)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </article>
        <CheckoutClient
          course={{
            id: course.id,
            slug: course.slug,
            title: course.title,
            price: course.price,
          }}
          nextLessonSlug={nextLessonSlug}
        />
      </section>
    </div>
  );
}
