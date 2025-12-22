import { Metadata } from "next";
import { getMyLearning } from "@/service/course.service";
import LearningClient from "./_components/learning-client";

export const metadata: Metadata = {
  title: "Learning",
  description: "Generate questions and track your learning progress",
};

export default async function LearningPage() {
  let coursesData;
  try {
    coursesData = await getMyLearning({
      page: 1,
      limit: 100,
    });
  } catch (error) {
    coursesData = {
      courses: [],
      pagination: { page: 1, limit: 100, total: 0, totalPages: 0 },
    };
  }

  const { courses } = coursesData;

  return (
    <div className="py-8 container-sm">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Learning</h1>
        <p className="text-muted-foreground">
          Generate questions and track your learning progress
        </p>
      </div>

      <LearningClient initialCourses={courses} />
    </div>
  );
}
