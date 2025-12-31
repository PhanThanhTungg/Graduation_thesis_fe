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
import {
  AdminRoleWithPermissions,
  formatPermissionObject,
  formatPermissionAction,
} from "@/lib/admin-permissions-mock-data";

type PermissionsDataTableProps = {
  data: AdminRoleWithPermissions[];
};

export function PermissionsDataTable({ data }: PermissionsDataTableProps) {
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
            <div className="flex flex-wrap gap-2">
              {Array.from(permissionMap.entries()).map(([object, actions]) => (
                <div key={object} className="flex flex-col gap-1">
                  <Badge variant="outline" className="w-fit">
                    {formatPermissionObject(object)}
                  </Badge>
                  <div className="flex gap-1 ml-2">
                    {Array.from(actions).map((action) => (
                      <Badge
                        key={`${object}-${action}`}
                        variant="secondary"
                        className="text-xs"
                      >
                        {formatPermissionAction(action)}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        },
      },
      {
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
    </div>
  );
}
