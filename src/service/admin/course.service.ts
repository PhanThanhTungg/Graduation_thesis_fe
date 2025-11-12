import { get, del } from "@/lib/request";

export interface AdminCourseFilters {
  keySearch?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  categoryId?: string;
  isPublished?: boolean;
  includeDeleted?: boolean;
}

export interface AdminCourseItem {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  price: number;
  countStudent: number;
  isPublished: boolean;
  teacher: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface AdminCoursePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminCoursesResponse {
  message: string;
  data: {
    items: AdminCourseItem[];
    pagination: AdminCoursePagination;
  };
}

export const getAllCoursesAdmin = async (filters?: AdminCourseFilters) => {
  try {
    const params: Record<string, string> = {};
    
    if (filters?.keySearch) params.keySearch = filters.keySearch;
    if (filters?.sortField) params.sortField = filters.sortField;
    if (filters?.sortOrder) params.sortOrder = filters.sortOrder;
    if (filters?.page) params.page = String(filters.page);
    if (filters?.limit) params.limit = String(filters.limit);
    if (filters?.categoryId) params.categoryId = filters.categoryId;
    if (filters?.isPublished !== undefined) params.isPublished = String(filters.isPublished);
    if (filters?.includeDeleted !== undefined) params.includeDeleted = String(filters.includeDeleted);

    const response = await get<AdminCoursesResponse>('/api/admin/course', params);
    
    if (response.status === 200 && 'data' in response.payload) {
      return response.payload.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return null;
  }
};

export const deleteCourseAdmin = async (id: string) => {
  try {
    const response = await del<{ message: string }>(`/api/admin/course/${id}`, undefined);
    
    if (response.status === 200) {
      return response.payload;
    }
    
    throw new Error(response.payload.message || 'Failed to delete course');
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};
