import { ReactNode } from "react";
import { AdminAction, AdminObject } from "@/lib/permission";
import {
  hasServerPermission,
  hasAllServerPermissions,
  hasAnyServerPermission,
} from "@/lib/server-permission";
import { AlertCircle } from "lucide-react";

interface PermissionGuardProps {
  object: AdminObject;
  action: AdminAction;
  children: ReactNode;
  fallback?: ReactNode;
}

interface MultiPermissionGuardProps {
  requiredPermissions: Array<{ object: AdminObject; action: AdminAction }>;
  requireAll?: boolean; // true = require all permissions, false = require any permission
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Server-side permission guard component
 * Only renders children if admin has the required permission
 */
export async function ServerPermissionGuard({
  object,
  action,
  children,
  fallback,
}: PermissionGuardProps) {
  const hasAccess = await hasServerPermission(object, action);

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
 * Server-side multi-permission guard component
 * Checks multiple permissions at once
 */
export async function ServerMultiPermissionGuard({
  requiredPermissions,
  requireAll = true,
  children,
  fallback,
}: MultiPermissionGuardProps) {
  const hasAccess = requireAll
    ? await hasAllServerPermissions(requiredPermissions)
    : await hasAnyServerPermission(requiredPermissions);

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
