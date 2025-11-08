import {
  CourseFilters,
  CoursePagination,
} from "./_components";
import BreadcrumbCustom, { BreadcrumbProps } from "@/components/custom/breadcrumb";
import CourseCard from "@/components/custom/course-card";
import { getAllCourses } from "@/service/course.service";

const breadcrumbData: BreadcrumbProps[] = [
  { url: "/", label: "Home" },
  { url: undefined, label: "Courses" },
]

export default async function CoursesPage() {
  const { courses, pagination } = await getAllCourses({ page: 1, limit: 6 });
  const totalPages = pagination.totalPages;

  return (
    <>
      {/* Breadcrumb Section */}
      <BreadcrumbCustom breadcrumb={breadcrumbData} />

      {/* Main Content */}
      <div className="container-md py-15">
        <div className="flex gap-8">
          {/* Main Listing */}
          <div className="flex-1 flex flex-col gap-8">
            <h1 className="text-4xl font-semibold text-foreground capitalize font-heading">
              All Courses
            </h1>

            {/* Course List */}
            <div className="grid grid-cols-3 gap-4">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-[30px]">
              <CoursePagination totalPages={totalPages} />
            </div>
          </div>

          {/* Sidebar Filters */}
          <CourseFilters />
        </div>
      </div>
    </>
  );
}