import { get, post, patch, del } from "@/lib/request";
import { showToast } from "@/lib/toast";
import {
  AdminAccountListResponse,
  AdminAccountParams,
  CreateAdminInput,
  UpdateAdminInput,
  ChangePasswordInput,
  AdminAccountCreateResponse,
  AdminAccountUpdateResponse,
  ChangePasswordResponse,
  AdminDeleteResponse,
  AdminAccount,
} from "@/schema/admin.schema";
import { redirect } from "next/navigation";

export const getAllAdminAccounts = async (
  params: AdminAccountParams,
): Promise<AdminAccountListResponse["data"]> => {
  const res = await get<AdminAccountListResponse>("/api/admin/account", params);

  if (res.status === 200) {
    return res.payload.data;
  } else {
    redirect("/error-fetch-data");
  }
};

export const createAdminAccount = async (
  data: CreateAdminInput,
): Promise<AdminAccount | null> => {
  const res = await post<AdminAccountCreateResponse>("api/admin/account", data);

  if (res.status === 201 || res.status === 200) {
    return res.payload.data;
  }
  return null;
};

export const updateAdminAccount = async (
  adminId: string,
  data: UpdateAdminInput,
): Promise<AdminAccount | null> => {
  const res = await patch<AdminAccountUpdateResponse>(
    `api/admin/account/${adminId}`,
    data,
  );

  if (res.status === 200) {
    return res.payload.data;
  }
  return null;
};

export const changeAdminPassword = async (
  adminId: string,
  data: ChangePasswordInput,
): Promise<void> => {
  const res = await patch<ChangePasswordResponse>(
    `api/admin/account/${adminId}/password`,
    data,
  );

  if (res.status === 200) {
    showToast(
      "success",
      res.payload.message || "Password changed successfully",
    );
  } else {
    showToast("error", res.payload.message || "Failed to change password");
  }
};

export const deleteAdminAccount = async (adminId: string): Promise<boolean> => {
  const res = await del<AdminDeleteResponse>(`api/admin/account/${adminId}`);

  if (res.status === 200) {
    showToast(
      "success",
      res.payload.message || "Admin account deleted successfully",
    );
    return true;
  }
  showToast("error", res.payload.message || "Failed to delete admin account");
  return false;
};
