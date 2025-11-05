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