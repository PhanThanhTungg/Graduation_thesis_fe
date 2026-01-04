import {
  AdminRoleWithPermissions,
  AdminPermission,
} from "@/lib/admin-permissions-mock-data";
import { get, post, patch, del } from "@/lib/request";
import { AdminRoleBody } from "@/schema/admin.schema";

export interface CreateRoleInput {
  title: string;
  description?: string;
  permissionIds: string[];
}

export type UpdateRoleInput = {
  title?: string;
  description?: string;
  permissionIds?: string[];
};

export const getAdminRolesWithPermissions = async (): Promise<
  AdminRoleWithPermissions[]
> => {
  const res = await get<{ message: string; data: AdminRoleWithPermissions[] }>(
    "api/admin/role",
    undefined,
  );

  if (res.status === 200) {
    return res.payload.data;
  }
  return [];
};

export const getAllPermissions = async (): Promise<AdminPermission[]> => {
  const res = await get<{ message: string; data: AdminPermission[] }>(
    "api/admin/permission",
    undefined,
  );

  if (res.status === 200) {
    return res.payload.data;
  }
  return [];
};

export const createRole = async (data: AdminRoleBody) => {
  const res = await post<{ message: string; data: AdminRoleWithPermissions }>(
    "api/admin/role",
    data,
  );

  if (res.status === 201 || res.status === 200) {
    return {
      success: true,
      message: res.payload.message,
      data: res.payload.data,
    };
  }
  return { success: false, message: "Failed to create role" };
};

export const updateRole = async (roleId: string, data: AdminRoleBody) => {
  const res = await patch<{ message: string; data: AdminRoleWithPermissions }>(
    `api/admin/role/${roleId}`,
    data,
  );

  if (res.status === 200) {
    return {
      success: true,
      message: res.payload.message,
      data: res.payload.data,
    };
  }
  return { success: false, message: "Failed to update role" };
};

export const deleteRole = async (roleId: string) => {
  const res = await del<{ message: string }>(`api/admin/role/${roleId}`);

  if (res.status === 200) {
    return { success: true, message: res.payload.message };
  }
  return { success: false, message: "Failed to delete role" };
};
