import { mockCourses } from "@/lib/mockData";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Lessons - Teacher Space",
  description: "Manage your lessons effectively",
}

export default async function TeacherLessonsPage() {
  const courses = mockCourses;

  return (
    <section className="container-xl py-4">
      <h1 className="sr-only">Manage lessons</h1>
      <h2 className="text-xl font-semibold mb-4">Select a courses</h2>

      <ul className="space-y-2">
        {courses.map((course) => (
          <li key={course.id}>
            <Link 
              href={`/teacher/lessons/${course.slug}`}
              className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="relative w-24 h-16 flex-shrink-0">
                <Image
                  src={course.thumbnailUrl || ""}
                  alt={course.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{course.title}</h3>
                <span className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                  course.isPublished 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}