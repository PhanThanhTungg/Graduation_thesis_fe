import { PermissionsDataTable } from "./listPermissions";
import {
  getAdminRolesWithPermissions,
  getAllPermissions,
} from "@/service/admin/role-permission.service";
import { hasServerPermission } from "@/lib/server-permission";
import { AlertCircle } from "lucide-react";

export default async function PermissionsPage() {
  // Check permission FIRST before fetching data
  const hasAccess = await hasServerPermission("permission", "view");

  if (!hasAccess) {
    return (
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
    );
  }

  // Only fetch data if has permission
  const [roles, permissions] = await Promise.all([
    getAdminRolesWithPermissions(),
    getAllPermissions(),
  ]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Permissions Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage admin roles and their permissions
        </p>
      </div>
      <PermissionsDataTable data={roles} permissions={permissions} />
    </div>
  );
}
