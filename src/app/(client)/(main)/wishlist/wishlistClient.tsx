"use client";

import CourseCard from "@/components/custom/course-card";
import { RootState, AppDispatch } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  fetchWishlistCourses,
  selectWishlistItems,
  selectWishlistStatus,
} from "@/store/features/wishlistSlice";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/components/custom/loading-animation";

export default function WishlistClient() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const courses = useSelector((state: RootState) => selectWishlistItems(state));
  const status = useSelector((state: RootState) => selectWishlistStatus(state));

  useEffect(() => {
    dispatch(fetchWishlistCourses());
  }, [dispatch]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="w-screen h-[calc(100vh-90px)] flex items-center justify-center">
        <LoadingAnimation />
      </div>
    );
  }

  if (status === "failed") {
    router.push("/error-fetch-data");
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <p>No courses in your wishlist.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
