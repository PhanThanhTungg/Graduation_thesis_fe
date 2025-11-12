import { get } from "@/lib/request";
import { CategoryResponseType, CategoryType } from "@/schema/category.schema";
import { redirect } from "next/navigation";

export const getAllCategories = async (): Promise<CategoryType[]> => {
  const response = await get<CategoryResponseType>(
    '/api/category',
    undefined
  )
  if (response.status === 200 && 'data' in response.payload) {
    const payload = response.payload as CategoryResponseType;
    return payload.data.categories;
  } else {
    redirect('/error-fetch-data');
  }
};

export const getLeafCategories = async (): Promise<CategoryType[]> => {
  const response = await get<CategoryResponseType>(
    '/api/category/leaf',
    undefined
  )
  if (response.status === 200 && 'data' in response.payload) {
    const payload = response.payload as CategoryResponseType;
    return payload.data.categories;
  } else {
    redirect('/error-fetch-data');
  }
};
