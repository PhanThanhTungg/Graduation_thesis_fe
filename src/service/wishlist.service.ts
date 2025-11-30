import { del, get, post } from "@/lib/request";
import { showToast } from "@/lib/toast";
import { CourseType, GetAllCourseResponseType } from "@/schema/course.schema";
import { redirect } from "next/navigation";

export const getAllCourseFromWishList = async (): Promise<CourseType[]> => {
  const response = await get<GetAllCourseResponseType>(
    "/api/course/student-area/wish-list",
    undefined,
  );
  if (response.status === 200 && "data" in response.payload) {
    return response.payload.data.items;
  } else {
    redirect("/error-fetch-data");
  }
};

export const addCourseToWishList = async (
  courseId: string,
): Promise<boolean> => {
  const response = await post<{ message: string }>(
    `/api/course/student-area/wish-list/${courseId}`,
    undefined,
  );
  if (response.status === 201) {
    showToast("success", response.payload.message);
    return true;
  } else {
    showToast(
      "error",
      response.payload.message || "Failed to add course to wishlist",
    );
    return false;
  }
};

export const removeCourseFromWishList = async (
  courseId: string,
): Promise<boolean> => {
  const response = await del<{ message: string }>(
    `/api/course/student-area/wish-list/${courseId}`,
    undefined,
  );
  if (response.status === 200) {
    showToast("success", response.payload.message);
    return true;
  } else {
    showToast(
      "error",
      response.payload.message || "Failed to remove course from wishlist",
    );
    return false;
  }
};
