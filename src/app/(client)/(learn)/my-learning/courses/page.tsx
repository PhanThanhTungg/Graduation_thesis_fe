import { Metadata } from "next";
import { getMyLearning } from "@/service/course.service";
import MyLearningClient from "../_components/my-learning-client";

export const metadata: Metadata = {
  title: "My Learning",
  description: "Your purchased courses in Aikabis Learning Platform",
};

interface MyLearningPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function MyLearningPage({
  searchParams,
}: MyLearningPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 12;
  const search = params.search?.trim() || "";

  let coursesData;
  try {
    coursesData = await getMyLearning({
      page,
      limit,
      ...(search && { keySearch: search }),
    });
  } catch (error) {
    coursesData = {
      courses: [],
      pagination: { page: 1, limit, total: 0, totalPages: 0 },
    };
  }

  const { courses, pagination } = coursesData;

  return (
    <>
      <section className="container-md">
        <div className="mb-3">
          <h1 className="text-2xl font-bold mb-2">My purchased courses</h1>
          <p className="text-muted-foreground text-sm">
            Your purchased courses in Aikabis Learning Platform
          </p>
        </div>

        <MyLearningClient
          initialCourses={courses}
          initialPagination={pagination}
        />
      </section>
    </>
  );
}
