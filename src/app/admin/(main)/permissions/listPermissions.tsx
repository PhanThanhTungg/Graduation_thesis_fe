"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
import {
  AdminRoleWithPermissions,
  AdminPermission,
  formatPermissionObject,
  formatPermissionAction,
} from "@/lib/admin-permissions-mock-data";
import { RoleDialog } from "./role-dialog";
import { DeleteRoleDialog } from "./delete-role-dialog";
import { PermissionGuard } from "@/components/admin/PermissionGuard";

type PermissionsDataTableProps = {
  data: AdminRoleWithPermissions[];
  permissions: AdminPermission[];
};

export function PermissionsDataTable({
  data,
  permissions,
}: PermissionsDataTableProps) {
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] =
    React.useState<AdminRoleWithPermissions | null>(null);

  const handleEdit = (role: AdminRoleWithPermissions) => {
    setSelectedRole(role);
    setEditDialogOpen(true);
  };

  const handleDelete = (role: AdminRoleWithPermissions) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  const columns: ColumnDef<AdminRoleWithPermissions>[] = React.useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Role",
        cell: ({ row }) => {
          const role = row.original;
          return (
            <div className="flex flex-col">
              <span className="font-medium text-primary">
                {role.title || "Untitled"}
              </span>
              {role.description && (
                <span className="text-sm text-muted-foreground">
                  {role.description}
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "permissions",
        header: "Permissions",
        cell: ({ row }) => {
          const permissions = row.original.permissions;
          const permissionMap = new Map<string, Set<string>>();

          permissions.forEach((perm) => {
            const object = perm.adminPermission.object;
            const action = perm.adminPermission.action;
            if (!permissionMap.has(object)) {
              permissionMap.set(object, new Set());
            }
            permissionMap.get(object)?.add(action);
          });

          return (
            <div className="flex flex-wrap gap-1.5 max-w-md">
              {Array.from(permissionMap.entries()).map(([object, actions]) => (
                <Badge
                  key={object}
                  variant="outline"
                  className="px-2 py-1 text-xs font-normal"
                >
                  <span className="font-semibold">
                    {formatPermissionObject(object)}
                  </span>
                  <span className="mx-1.5 text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {Array.from(actions)
                      .map((action) => formatPermissionAction(action))
                      .join(", ")}
                  </span>
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        id: "permissionsCount",
        accessorKey: "permissions",
        header: "Total Permissions",
        cell: ({ row }) => {
          return (
            <span className="text-sm font-medium">
              {row.original.permissions.length} permissions
            </span>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const role = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <PermissionGuard object="permission" action="edit">
                  <DropdownMenuItem onClick={() => handleEdit(role)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                </PermissionGuard>
                <PermissionGuard object="permission" action="delete">
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => handleDelete(role)}
                    className="focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </PermissionGuard>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end">
        <PermissionGuard object="permission" action="create">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </PermissionGuard>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No roles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <RoleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        permissions={permissions}
        mode="create"
      />

      <RoleDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        role={selectedRole || undefined}
        permissions={permissions}
        mode="edit"
      />

      {selectedRole && (
        <DeleteRoleDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          roleId={selectedRole.id}
          roleTitle={selectedRole.title || ""}
        />
      )}
    </div>
  );
}
