import { useState, useEffect, useCallback } from 'react';
import { CategoryType } from '@/schema/category.schema';
import { getAllCategories, deleteCategory } from '@/service/admin/category.service';
import { showToast } from '@/lib/toast';

export function useCategories() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast('error', 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      showToast('success', 'Category deleted successfully');
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast('error', 'Failed to delete category');
      throw error;
    }
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    refetch: fetchCategories,
    deleteCategory: handleDelete,
  };
}

