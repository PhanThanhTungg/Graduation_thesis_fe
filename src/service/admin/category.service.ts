import { get, patch, post, del } from "@/lib/request";
import { CategoryResponseType, CreateCategoryInput, CreateCategoryResponse, UpdateCategoryInput, UpdateCategoryResponse } from "@/schema/category.schema";

export const getCategoryBySlug = async (slug: string) => {
  try {
    const response = await get<CategoryResponseType>(`/api/admin/category/slug/${slug}`, {});
    
    if (response.status === 200 && 'data' in response.payload) {
      return response.payload.data.categories[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
};

export const updateCategory = async (id: string, data: UpdateCategoryInput) => {
  const response = await patch<UpdateCategoryResponse>(`/api/admin/category/${id}`, data);
  
  if (response.status === 200 && 'data' in response.payload) {
    return response.payload;
  }
  
  throw new Error(response.payload.message || 'Failed to update category');
};

export const getAllCategories = async () => {
  try {
    const response = await get<CategoryResponseType>('/api/admin/category', {});
    
    if (response.status === 200 && 'data' in response.payload) {
      return response.payload.data.categories;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const createCategory = async (data: CreateCategoryInput) => {
  const response = await post<CreateCategoryResponse>('/api/admin/category', data);
  
  if (response.status === 201 && 'data' in response.payload) {
    return response.payload;
  }
  
  throw new Error(response.payload.message || 'Failed to create category');
};

export const deleteCategory = async (id: string) => {
  const response = await del<{ message: string }>(`/api/admin/category/${id}`, undefined);
  
  if (response.status === 200) {
    return response.payload;
  }
  
  throw new Error(response.payload.message || 'Failed to delete category');
};