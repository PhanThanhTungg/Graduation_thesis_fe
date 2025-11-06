import { get, patch } from "@/lib/request"
import { showToast } from "@/lib/toast"
import { UpdateUserBodyType, UserType, UpdateTeacherProfileType, TeacherType } from "@/schema/user.schema"
import { SubmitHandler } from "react-hook-form"

export const getMyProfile = async(): Promise<UserType | TeacherType | null> => {
  const response = await get<any>('/api/profile', undefined)
  if (response.status === 200) {
    const data = response.payload as any;
    
    if (data.role === 'teacher') {
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
    return null
  }
}

export const updateUserInfo: SubmitHandler<UpdateUserBodyType> = async(data): Promise<void> => {
  const response = await patch('/api/profile', data);
  if (response.status === 200) {
    showToast("success", "Profile updated successfully");
  } else {
    showToast("error", "Failed to update profile");
  }
}

export const promoteToTeacher = async(currentUser: UserType): Promise<boolean> => {
  const response = await patch('/api/profile', {
    fullName: currentUser.fullName,
    email: currentUser.email,
    country: currentUser.country,
    avatarUrl: currentUser.avatarUrl,
    role: 'teacher'
  });
  if (response.status === 200) {
    showToast("success", "You are now a teacher");
    return true;
  } else {
    showToast("error", "Failed to update role");
    return false;
  }
}

export const updateTeacherProfile: SubmitHandler<UpdateTeacherProfileType> = async(data): Promise<void> => {
  const cleanedData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
  ) as UpdateTeacherProfileType;
  
  const response = await patch('/api/profile/teacher', cleanedData);
  if (response.status === 200) {
    showToast("success", "Teacher profile updated successfully");
  } else {
    showToast("error", (response.payload as any)?.message || "Failed to update teacher profile");
  }
}