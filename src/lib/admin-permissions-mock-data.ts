export interface AdminPermission {
  id: string;
  object:
    | "user_management"
    | "course_management"
    | "category_management"
    | "admin_management"
    | "finance"
    | "statistics";
  action: "view" | "edit";
}

export interface AdminRoleWithPermissions {
  id: string;
  title: string | null;
  description: string | null;
  permissions: Array<{
    adminPermissionId: string;
    adminPermission: AdminPermission;
  }>;
}

export interface PermissionItem {
  id: string;
  object:
    | "user_management"
    | "course_management"
    | "category_management"
    | "admin_management"
    | "finance"
    | "statistics";
  action: "view" | "edit";
}

export const getAdminRoles = (): AdminRoleWithPermissions[] => {
  return [
    {
      id: "1",
      title: "Super Admin",
      description: "Full access to all system features and settings",
      permissions: [
        {
          adminPermissionId: "1",
          adminPermission: {
            id: "1",
            object: "user_management",
            action: "view",
          },
        },
        {
          adminPermissionId: "2",
          adminPermission: {
            id: "2",
            object: "user_management",
            action: "edit",
          },
        },
        {
          adminPermissionId: "3",
          adminPermission: {
            id: "3",
            object: "course_management",
            action: "view",
          },
        },
        {
          adminPermissionId: "4",
          adminPermission: {
            id: "4",
            object: "course_management",
            action: "edit",
          },
        },
        {
          adminPermissionId: "5",
          adminPermission: {
            id: "5",
            object: "category_management",
            action: "view",
          },
        },
        {
          adminPermissionId: "6",
          adminPermission: {
            id: "6",
            object: "category_management",
            action: "edit",
          },
        },
        {
          adminPermissionId: "7",
          adminPermission: {
            id: "7",
            object: "admin_management",
            action: "view",
          },
        },
        {
          adminPermissionId: "8",
          adminPermission: {
            id: "8",
            object: "admin_management",
            action: "edit",
          },
        },
        {
          adminPermissionId: "9",
          adminPermission: {
            id: "9",
            object: "finance",
            action: "view",
          },
        },
        {
          adminPermissionId: "10",
          adminPermission: {
            id: "10",
            object: "finance",
            action: "edit",
          },
        },
        {
          adminPermissionId: "11",
          adminPermission: {
            id: "11",
            object: "statistics",
            action: "view",
          },
        },
        {
          adminPermissionId: "12",
          adminPermission: {
            id: "12",
            object: "statistics",
            action: "edit",
          },
        },
      ],
    },
    {
      id: "2",
      title: "Content Manager",
      description: "Manage courses and categories",
      permissions: [
        {
          adminPermissionId: "3",
          adminPermission: {
            id: "3",
            object: "course_management",
            action: "view",
          },
        },
        {
          adminPermissionId: "4",
          adminPermission: {
            id: "4",
            object: "course_management",
            action: "edit",
          },
        },
        {
          adminPermissionId: "5",
          adminPermission: {
            id: "5",
            object: "category_management",
            action: "view",
          },
        },
        {
          adminPermissionId: "6",
          adminPermission: {
            id: "6",
            object: "category_management",
            action: "edit",
          },
        },
      ],
    },
    {
      id: "3",
      title: "User Manager",
      description: "Manage users and their accounts",
      permissions: [
        {
          adminPermissionId: "1",
          adminPermission: {
            id: "1",
            object: "user_management",
            action: "view",
          },
        },
        {
          adminPermissionId: "2",
          adminPermission: {
            id: "2",
            object: "user_management",
            action: "edit",
          },
        },
      ],
    },
    {
      id: "4",
      title: "Viewer",
      description: "View-only access to all modules",
      permissions: [
        {
          adminPermissionId: "1",
          adminPermission: {
            id: "1",
            object: "user_management",
            action: "view",
          },
        },
        {
          adminPermissionId: "3",
          adminPermission: {
            id: "3",
            object: "course_management",
            action: "view",
          },
        },
        {
          adminPermissionId: "5",
          adminPermission: {
            id: "5",
            object: "category_management",
            action: "view",
          },
        },
      ],
    },
  ];
};

export const formatPermissionObject = (object: string): string => {
  return object
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatPermissionAction = (action: string): string => {
  return action.charAt(0).toUpperCase() + action.slice(1);
};
