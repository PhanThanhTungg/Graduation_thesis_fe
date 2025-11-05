import { get, patch } from "@/lib/request"
import { showToast } from "@/lib/toast"
import { UpdateUserBodyType, UserType } from "@/schema/user.schema"
import { SubmitHandler } from "react-hook-form"

export const getMyProfile = async(): Promise<UserType | null> => {
  const response = await get<UserType>('/api/profile', undefined)
  if (response.status === 200) {
    return response.payload as UserType
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