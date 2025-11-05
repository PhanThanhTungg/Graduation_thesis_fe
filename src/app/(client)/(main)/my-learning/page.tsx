import CourseCard from "@/components/custom/course-card";
import { mockCourses } from "@/lib/mockData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Learning",
  description: "Your purchased courses in Aikabis Learning Platform",
}

export default async function MyLearningPage() {
  const courses = mockCourses;

  return (
    <>
      <section className="container-md py-16">
        <h1 className="text-4xl font-bold">My Learning</h1>
        <p>Your purchased courses in Aikabis Learning Platform</p>

        <div className="mt-8 grid grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </>
  )
}