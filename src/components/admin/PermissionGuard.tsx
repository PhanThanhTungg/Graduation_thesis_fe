"use client";

import { ReactNode } from "react";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { AdminObject, AdminAction } from "@/lib/permission";

interface PermissionGuardProps {
  children: ReactNode;
  object: AdminObject;
  action: AdminAction;
  fallback?: ReactNode;
}

/**
 * Component wrapper to show/hide UI based on permission
 * Usage:
 * <PermissionGuard object="course" action="create">
 *   <Button>Create Course</Button>
 * </PermissionGuard>
 */
export const PermissionGuard = ({
  children,
  object,
  action,
  fallback = null,
}: PermissionGuardProps) => {
  const { hasPermission, isLoading } = useAdminPermissions();

  if (isLoading) {
    return null;
  }

  if (!hasPermission(object, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface MultiPermissionGuardProps {
  children: ReactNode;
  permissions: Array<{ object: AdminObject; action: AdminAction }>;
  requireAll?: boolean;
  fallback?: ReactNode;
}

/**
 * Component wrapper for multiple permissions
 * Usage:
 * <MultiPermissionGuard
 *   permissions={[
 *     { object: "course", action: "view" },
 *     { object: "course", action: "edit" }
 *   ]}
 *   requireAll={true}
 * >
 *   <AdminPanel />
 * </MultiPermissionGuard>
 */
export const MultiPermissionGuard = ({
  children,
  permissions,
  requireAll = true,
  fallback = null,
}: MultiPermissionGuardProps) => {
  const { hasAllPermissions, hasAnyPermission, isLoading } =
    useAdminPermissions();

  if (isLoading) {
    return null;
  }

  const hasAccess = requireAll
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
