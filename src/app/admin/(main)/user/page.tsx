"use client"

import { useCallback, useEffect, useState } from "react"
import { UserDataTable } from "./listUsers"
import {
  getAllUsers,
  GetAllUsersParams,
  UserListItem,
  updateUserStatus,
} from "@/service/admin/user.service"
import { toast } from "sonner"

export default function UserPage() {
  const [users, setUsers] = useState<UserListItem[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<GetAllUsersParams>({
    page: 1,
    limit: 10,
    sortField: "createdAt",
    sortOrder: "desc",
  })

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getAllUsers(filters)
      setUsers(data.items)
      setPagination(data.pagination)
    } catch (error) {
      toast.error("An error occurred while fetching users")
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handlePaginationChange = (page: number, limit: number) => {
    setFilters((prev) => ({ ...prev, page, limit }))
  }

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, keySearch: search || undefined, page: 1 }))
  }

  const handleSortChange = (sortField: string, sortOrder: "asc" | "desc") => {
    setFilters((prev) => ({ ...prev, sortField, sortOrder }))
  }

  const handleRoleFilterChange = (role: "teacher" | "student" | "all") => {
    setFilters((prev) => ({
      ...prev,
      role: role === "all" ? undefined : role,
      page: 1,
    }))
  }

  const handleStatusChange = async (
    userId: string,
    status: "active" | "inactive" | "banned"
  ) => {
    try {
      await updateUserStatus(userId, status)
      toast.success("User status updated successfully")
      // Update local state
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, status } : user))
      )
    } catch (error) {
      toast.error("An error occurred while updating user status")
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage all users in the system
        </p>
      </div>
      <UserDataTable
        data={users}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onRoleFilterChange={handleRoleFilterChange}
        onStatusChange={handleStatusChange}
        isLoading={isLoading}
      />
    </div>
  )
}