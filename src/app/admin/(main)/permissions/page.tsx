import { PermissionsDataTable } from "./listPermissions";
import {
  getAdminRolesWithPermissions,
  getAllPermissions,
} from "@/service/admin/role-permission.service";

export default async function PermissionsPage() {
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
