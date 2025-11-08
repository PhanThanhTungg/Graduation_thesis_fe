'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { CategoryType } from '@/schema/category.schema';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  category: CategoryType | null;
  isDeleting?: boolean;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  category,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  if (!category) return null;

  const hasChildren = category.children && category.children.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
            </div>
            <DialogTitle className="text-2xl font-bold">Delete Category</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            This action cannot be undone. Are you sure you want to delete this category?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-4">
            <div className="space-y-2">
              <div>
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Category Name:</span>
                <p className="text-base font-medium text-zinc-900 dark:text-zinc-100 mt-1">
                  {category.title}
                </p>
              </div>
              
              {category.slug && (
                <div>
                  <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Slug:</span>
                  <p className="text-base text-zinc-700 dark:text-zinc-300 mt-1">
                    {category.slug}
                  </p>
                </div>
              )}

              {hasChildren && (
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-600 dark:text-amber-500">
                      Warning: This category has {category.children?.length} subcategories
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    Deleting this category will also affect its subcategories.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 p-4">
            <p className="text-sm text-red-800 dark:text-red-300">
              <strong>Note:</strong> This will permanently delete the category from the system. 
              Any courses associated with this category may be affected.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="text-base px-6 py-5"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-base px-6 py-5"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </div>
            ) : (
              'Delete Category'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
