'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryType } from '@/schema/category.schema';
import { CategoryModal } from './CategoryModal';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { CategoryItem } from './_components/CategoryItem';
import { useCategories } from './_components/useCategories';

export function ListCategory() {
  const { categories, loading, refetch, deleteCategory: deleteCategoryApi } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddCategory = (parentId?: string) => {
    setModalMode('add');
    setSelectedCategory(null);
    setSelectedParentId(parentId);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: CategoryType) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setSelectedParentId(undefined);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (category: CategoryType) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      await deleteCategoryApi(categoryToDelete.id);
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  const handleModalSuccess = () => {
    refetch();
  };

  return (
    <Card>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <span className="loading loading-spinner"></span>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onAdd={handleAddCategory}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-500 border-2 border-dashed rounded-lg">
            No categories found. Click &quot;Create New Category&quot; to create one.
          </div>
        )}
      </CardContent>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        category={selectedCategory || undefined}
        parentId={selectedParentId}
        onSuccess={handleModalSuccess}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        category={categoryToDelete}
        isDeleting={isDeleting}
      />
    </Card>
  );
}