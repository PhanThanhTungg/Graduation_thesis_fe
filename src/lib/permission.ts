import { getCookie } from "./cookie";

export type AdminObject =
  | "dashboard"
  | "course"
  | "category"
  | "transaction"
  | "payment"
  | "user"
  | "permission"
  | "admin"
  | "setting";

export type AdminAction = "view" | "edit" | "delete" | "create";

/**
 * Get admin permissions from cookie
 * Permissions are stored as array of strings like ["course_view", "admin_create"]
 */
export const getAdminPermissions = async (): Promise<string[]> => {
  try {
    const permissionsStr = await getCookie("admin_permissions");
    if (!permissionsStr) return [];

    const permissions = JSON.parse(permissionsStr);
    return Array.isArray(permissions) ? permissions : [];
  } catch (error) {
    console.error("Error getting admin permissions:", error);
    return [];
  }
};

/**
 * Check if admin has a specific permission
 */
export const hasPermission = async (
  object: AdminObject,
  action: AdminAction,
): Promise<boolean> => {
  const permissions = await getAdminPermissions();
  const permissionString = `${object}_${action}`;

  return permissions.includes(permissionString);
};

/**
 * Check if admin has all specified permissions
 */
export const hasAllPermissions = async (
  requiredPermissions: Array<{ object: AdminObject; action: AdminAction }>,
): Promise<boolean> => {
  const permissions = await getAdminPermissions();

  return requiredPermissions.every((required) => {
    const permissionString = `${required.object}_${required.action}`;
    return permissions.includes(permissionString);
  });
};

/**
 * Check if admin has any of the specified permissions
 */
export const hasAnyPermission = async (
  requiredPermissions: Array<{ object: AdminObject; action: AdminAction }>,
): Promise<boolean> => {
  const permissions = await getAdminPermissions();

  return requiredPermissions.some((required) => {
    const permissionString = `${required.object}_${required.action}`;
    return permissions.includes(permissionString);
  });
};
