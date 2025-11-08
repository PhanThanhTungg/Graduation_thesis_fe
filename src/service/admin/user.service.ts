import { get, patch } from "@/lib/request";
import type {
  UserListItem,
  UserListResponse,
  UserDetailResponse,
  UpdateUserStatusResponse,
  GetAllUsersParams,
} from "@/schema/user.schema";

// Re-export types for convenience
export type {
  UserListItem,
  UserListResponse,
  UserDetailResponse,
  UpdateUserStatusResponse,
  GetAllUsersParams,
};

/**
 * Get all users with pagination, search and filter
 */
export const getAllUsers = async (params?: GetAllUsersParams) => {
  try {
    const searchParams: Record<string, string> = {};
    
    if (params?.keySearch) searchParams.keySearch = params.keySearch;
    if (params?.role) searchParams.role = params.role;
    if (params?.sortField) searchParams.sortField = params.sortField;
    if (params?.sortOrder) searchParams.sortOrder = params.sortOrder;
    if (params?.page) searchParams.page = params.page.toString();
    if (params?.limit) searchParams.limit = params.limit.toString();

    const response = await get<UserListResponse>(
      "/api/admin/user",
      Object.keys(searchParams).length > 0 ? searchParams : undefined,
      {
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
      }
    );
    
    if (response.status === 200 && 'data' in response.payload) {
      return response.payload.data;
    }
    
    throw new Error(response.payload.message || 'Failed to fetch users');
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get user detail by ID
 */
export const getUserById = async (userId: string) => {
  try {
    const response = await get<UserDetailResponse>(`/api/admin/user/${userId}`, undefined, {
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
    });
    
    if (response.status === 200 && 'data' in response.payload) {
      return response.payload.data;
    }
    
    throw new Error(response.payload.message || 'Failed to fetch user');
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Update user status
 */
export const updateUserStatus = async (
  userId: string,
  status: "active" | "inactive" | "banned"
) => {
  try {
    const response = await patch<UpdateUserStatusResponse>(
      `/api/admin/user/${userId}/status`,
      { status },
      {
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
      }
    );
    
    if (response.status === 200 && 'data' in response.payload) {
      return response.payload.data;
    }
    
    throw new Error(response.payload.message || 'Failed to update user status');
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};
