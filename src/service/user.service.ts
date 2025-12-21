import { get, patch, post } from "@/lib/request";
import { showToast } from "@/lib/toast";
import {
  UpdateUserBodyType,
  UserType,
  UpdateTeacherProfileType,
  TeacherType,
  SearchUsersResponse,
  SearchedUser,
} from "@/schema/user.schema";
import { SubmitHandler } from "react-hook-form";

interface ApiResponse {
  role?: string;
  teacherSetting?: {
    bio?: string;
    headline?: string;
    website?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
  };
  [key: string]: unknown;
}

interface ErrorResponse {
  message?: string;
}

export const getMyProfile = async (): Promise<
  UserType | TeacherType | null
> => {
  const response = await get<ApiResponse>("/api/profile", undefined);
  if (response.status === 200) {
    const data = response.payload as ApiResponse;

    if (data.role === "teacher") {
      const teacherSetting = data.teacherSetting || {};
      return {
        ...data,
        bio: teacherSetting.bio || null,
        headline: teacherSetting.headline || null,
        website: teacherSetting.website || null,
        facebook: teacherSetting.facebook || null,
        linkedin: teacherSetting.linkedin || null,
        youtube: teacherSetting.youtube || null,
      } as TeacherType;
    }

    return data as UserType;
  } else {
    return null;
  }
};

export const updateUserInfo: SubmitHandler<UpdateUserBodyType> = async (
  data,
): Promise<void> => {
  const response = await patch("/api/profile", data);
  if (response.status === 200) {
    showToast("success", "Profile updated successfully");
  } else {
    showToast("error", "Failed to update profile");
  }
};

export const promoteToTeacher = async (
  currentUser: UserType,
): Promise<boolean> => {
  const response = await patch("/api/profile", {
    fullName: currentUser.fullName,
    email: currentUser.email,
    country: currentUser.country,
    avatarUrl: currentUser.avatarUrl,
    role: "teacher",
  });
  if (response.status === 200) {
    showToast("success", "You are now a teacher");
    return true;
  } else {
    showToast("error", "Failed to update role");
    return false;
  }
};

export const updateTeacherProfile: SubmitHandler<
  UpdateTeacherProfileType
> = async (data): Promise<void> => {
  const cleanedData = Object.fromEntries(
    Object.entries(data).filter(
      ([, v]) => v !== "" && v !== null && v !== undefined,
    ),
  ) as UpdateTeacherProfileType;

  const response = await patch<ErrorResponse>(
    "/api/profile/teacher",
    cleanedData,
  );
  if (response.status === 200) {
    showToast("success", "Teacher profile updated successfully");
  } else {
    showToast(
      "error",
      (response.payload as ErrorResponse)?.message ||
        "Failed to update teacher profile",
    );
  }
};

export const searchUsers = async (
  keySearch: string,
  limit?: number,
): Promise<SearchedUser[]> => {
  try {
    const searchParams: Record<string, string> = {
      keySearch,
    };

    if (limit) {
      searchParams.limit = limit.toString();
    }

    const response = await get<SearchUsersResponse>(
      "/api/user/search",
      searchParams,
    );

    if (response.status === 200 && "data" in response.payload) {
      return response.payload.data;
    }

    throw new Error(response.payload.message || "Failed to search users");
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

export const getUsersOnlineStatus = async (
  userIds: string[],
): Promise<
  Record<string, { isOnline: boolean; lastLoginAt: string | null }>
> => {
  if (userIds.length === 0) {
    return {};
  }

  try {
    const searchParams: Record<string, string> = {
      userIds: userIds.join(","),
    };

    const response = await get<{
      message: string;
      data: Record<string, { isOnline: boolean; lastLoginAt: string | null }>;
    }>("/api/user/online-status", searchParams);

    if (response.status === 200 && "data" in response.payload) {
      return response.payload.data;
    }

    throw new Error(
      response.payload.message || "Failed to get users online status",
    );
  } catch (error) {
    console.error("Error getting users online status:", error);
    throw error;
  }
};

export const updateLastLoginAt = async (): Promise<void> => {
  try {
    await post("/api/user/update-last-login", {});
  } catch (error) {
    console.error("Error updating last login:", error);
  }
};
