"use client";

import { useEffect, useState } from "react";
import {
  AdminObject,
  AdminAction,
  getAdminPermissions,
} from "@/lib/permission";

export const useAdminPermissions = () => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      const perms = await getAdminPermissions();
      setPermissions(perms);
      setIsLoading(false);
    };

    loadPermissions();
  }, []);

  const hasPermission = (object: AdminObject, action: AdminAction): boolean => {
    const permissionString = `${object}_${action}`;
    return permissions.includes(permissionString);
  };

  const hasAllPermissions = (
    requiredPermissions: Array<{ object: AdminObject; action: AdminAction }>,
  ): boolean => {
    return requiredPermissions.every((required) => {
      const permissionString = `${required.object}_${required.action}`;
      return permissions.includes(permissionString);
    });
  };

  const hasAnyPermission = (
    requiredPermissions: Array<{ object: AdminObject; action: AdminAction }>,
  ): boolean => {
    return requiredPermissions.some((required) => {
      const permissionString = `${required.object}_${required.action}`;
      return permissions.includes(permissionString);
    });
  };

  return {
    permissions,
    isLoading,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
  };
};
