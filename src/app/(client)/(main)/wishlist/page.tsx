// import CourseCard from "@/components/custom/course-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "Your saved wishlist courses in Aikabis Learning Platform",
}

export default async function WishlistPage() {

  return (
    <>
      <section className="container-md py-16">
        <h1 className="text-4xl font-bold">My Wishlist</h1>
        <p>Your saved wishlist courses in Aikabis Learning Platform</p>
        
        <div className="mt-8 grid grid-cols-3 gap-6">
          {/* {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))} */}
        </div>
      </section>
    </>
  )
}