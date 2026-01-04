import { cookies } from "next/headers";
import { AdminAction, AdminObject } from "./permission";

/**
 * Get admin permissions from cookie (server-side)
 */
export async function getServerAdminPermissions(): Promise<string[]> {
  try {
    const cookieStore = await cookies();
    const permissionsStr = cookieStore.get("admin_permissions")?.value;

    if (!permissionsStr) return [];

    const permissions = JSON.parse(permissionsStr);
    return Array.isArray(permissions) ? permissions : [];
  } catch (error) {
    console.error("Error getting admin permissions:", error);
    return [];
  }
}

/**
 * Check if admin has a specific permission (server-side)
 */
export async function hasServerPermission(
  object: AdminObject,
  action: AdminAction,
): Promise<boolean> {
  const permissions = await getServerAdminPermissions();
  const permissionString = `${object}_${action}`;

  return permissions.includes(permissionString);
}

/**
 * Check if admin has all specified permissions (server-side)
 */
export async function hasAllServerPermissions(
  requiredPermissions: Array<{ object: AdminObject; action: AdminAction }>,
): Promise<boolean> {
  const permissions = await getServerAdminPermissions();

  return requiredPermissions.every((required) => {
    const permissionString = `${required.object}_${required.action}`;
    return permissions.includes(permissionString);
  });
}

/**
 * Check if admin has any of the specified permissions (server-side)
 */
export async function hasAnyServerPermission(
  requiredPermissions: Array<{ object: AdminObject; action: AdminAction }>,
): Promise<boolean> {
  const permissions = await getServerAdminPermissions();

  return requiredPermissions.some((required) => {
    const permissionString = `${required.object}_${required.action}`;
    return permissions.includes(permissionString);
  });
}
