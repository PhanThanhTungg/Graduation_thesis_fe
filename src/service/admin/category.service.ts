import { get, post } from "@/lib/request";
import { CategoryResponseType, CreateCategoryInput, CreateCategoryResponse } from "@/schema/category.schema";

export const getAllCategories = async () => {
  try {
    const response = await get<CategoryResponseType>('/api/category', {});
    
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
  const response = await post<CreateCategoryResponse>('/api/category', data);
  
  if (response.status === 201 && 'data' in response.payload) {
    return response.payload;
  }
  
  throw new Error(response.payload.message || 'Failed to create category');
};