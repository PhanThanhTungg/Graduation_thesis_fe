import {
  CourseFilters,
  CoursePagination,
} from "./_components";
import BreadcrumbCustom, { BreadcrumbProps } from "@/components/custom/breadcrumb";
import CourseCard from "@/components/custom/course-card";
import { getAllCourses } from "@/service/course.service";
import { getLeafCategories } from "@/service/category.service";

const breadcrumbData: BreadcrumbProps[] = [
  { url: "/", label: "Home" },
  { url: undefined, label: "Courses" },
]

interface CoursesPageProps {
  searchParams: Promise<{
    page?: string;
    categoryIds?: string;
    ratings?: string;
    priceFrom?: string;
    priceTo?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 6;

  // Build filter params
  const filterParams: Record<string, any> = {
    page,
    limit,
  };

  if (params.categoryIds) {
    filterParams.categoryIds = params.categoryIds;
  }

  if (params.ratings) {
    filterParams.ratings = params.ratings;
  }

  if (params.priceFrom) {
    filterParams.priceFrom = Number(params.priceFrom);
  }

  if (params.priceTo) {
    filterParams.priceTo = Number(params.priceTo);
  }

  // Fetch data
  const [coursesData, categories] = await Promise.all([
    getAllCourses(filterParams),
    getLeafCategories(),
  ]);

  const { items, pagination } = coursesData;

  return (
    <>
      {/* Breadcrumb Section */}
      <BreadcrumbCustom breadcrumb={breadcrumbData} />

      {/* Main Content */}
      <div className="container-md py-15">
        <div className="flex gap-8">
          {/* Main Listing */}
          <div className="flex-1 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-semibold text-foreground capitalize font-heading">
                All Courses
              </h1>
              <p className="text-muted-foreground">
                Showing {items.length} of {pagination.total} courses
              </p>
            </div>

            {/* Course List */}
            {items.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {items.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-2xl font-semibold text-muted-foreground mb-2">
                  No courses found
                </p>
                <p className="text-muted-foreground">
                  Try adjusting your filters to find what you&apos;re looking for
                </p>
              </div>
            )}

            {/* Pagination */}
            {items.length > 0 && (
              <div className="flex justify-center mt-[30px]">
                <CoursePagination 
                  totalPages={pagination.totalPages} 
                  currentPage={page}
                />
              </div>
            )}
          </div>

          {/* Sidebar Filters */}
          <CourseFilters categories={categories} />
        </div>
      </div>
    </>
  );
}