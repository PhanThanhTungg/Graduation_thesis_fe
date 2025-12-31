"use client";

import { useState } from "react";
import { PermissionsDataTable } from "./listPermissions";
import { getAdminRoles } from "@/lib/admin-permissions-mock-data";

export default function PermissionsPage() {
  const [roles] = useState(() => getAdminRoles());

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Permissions Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage admin roles and their permissions
        </p>
      </div>
      <PermissionsDataTable data={roles} />
    </div>
  );
}
