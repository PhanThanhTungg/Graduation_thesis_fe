"use client";

import { ReactNode } from "react";
import { AdminAction, AdminObject } from "@/lib/permission";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { AlertCircle } from "lucide-react";

interface ClientPermissionGuardProps {
  object: AdminObject;
  action: AdminAction;
  children: ReactNode;
  fallback?: ReactNode;
}

interface MultiPermissionGuardProps {
  requiredPermissions: Array<{ object: AdminObject; action: AdminAction }>;
  requireAll?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Client-side permission guard for full page protection
 * Shows "Access Denied" message if admin doesn't have permission
 */
export function ClientPermissionGuard({
  object,
  action,
  children,
  fallback,
}: ClientPermissionGuardProps) {
  const { hasPermission, isLoading } = useAdminPermissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const hasAccess = hasPermission(object, action);

  if (!hasAccess) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold">Access Denied</h3>
            <p className="text-muted-foreground">
              You do not have permission to view this content.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

/**
 * Client-side multi-permission guard for full page protection
 */
export function ClientMultiPermissionGuard({
  requiredPermissions,
  requireAll = true,
  children,
  fallback,
}: MultiPermissionGuardProps) {
  const { hasAllPermissions, hasAnyPermission, isLoading } =
    useAdminPermissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const hasAccess = requireAll
    ? hasAllPermissions(requiredPermissions)
    : hasAnyPermission(requiredPermissions);

  if (!hasAccess) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold">Access Denied</h3>
            <p className="text-muted-foreground">
              You do not have permission to view this content.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
