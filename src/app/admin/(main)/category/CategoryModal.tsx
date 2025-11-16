'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { CreateCategoryInput, CreateCategorySchema, CategoryType, UpdateCategoryInput, UpdateCategorySchema } from '@/schema/category.schema';
import { createCategory, updateCategory, getAllCategories } from '@/service/admin/category.service';
import { showToast } from '@/lib/toast';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ControllerRenderProps } from 'react-hook-form';

interface SubMenuProps {
  category: CategoryType;
  onSelect: (categoryId: string) => void;
  parentRect?: DOMRect;
}

const SubMenu = ({ category, onSelect, parentRect }: SubMenuProps) => {
  return (
    <div 
      className={cn(
        "absolute left-full top-0 min-w-[280px] bg-white dark:bg-zinc-950",
        "border rounded-md shadow-lg py-1",
        "animate-in slide-in-from-left-2 z-50"
      )}
      style={{
        transform: parentRect ? `translateX(8px)` : 'none'
      }}
    >
      {category.children?.map((child) => (
        <CategoryMenuItem
          key={child.id}
          category={child}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

interface CategoryMenuItemProps {
  category: CategoryType;
  onSelect: (categoryId: string) => void;
  excludeId?: string;
}

const findCategoryById = (categories: CategoryType[], id: string): CategoryType | undefined => {
  for (const category of categories) {
    if (category.id === id) return category;
    if (category.children) {
      const found = findCategoryById(category.children, id);
      if (found) return found;
    }
  }
  return undefined;
};

const CategoryMenuItem = ({ category, onSelect, excludeId }: CategoryMenuItemProps) => {
  const [showSubMenu, setShowSubMenu] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasChildren = category.children && category.children.length > 0;

  // Don't show the category if it's the one being edited
  if (excludeId && category.id === excludeId) {
    return null;
  }

  const handleMouseEnter = () => {
    if (hasChildren) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShowSubMenu(true);
    }
  };

  const handleMouseLeave = () => {
    if (hasChildren) {
      timeoutRef.current = setTimeout(() => {
        setShowSubMenu(false);
      }, 100);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(category.id);
  };

  return (
    <div
      ref={itemRef}
      className={cn(
        "relative flex items-center justify-between px-4 py-3 text-base cursor-pointer",
        "hover:bg-zinc-100 dark:hover:bg-zinc-800",
        "transition-colors duration-100",
        showSubMenu && "bg-zinc-100 dark:bg-zinc-800"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <span className="font-medium">{category.title}</span>
      {hasChildren && (
        <>
          <ChevronRight size={16} className={cn(
            "text-zinc-400 transition-transform duration-200",
            showSubMenu && "transform rotate-90"
          )} />
          {showSubMenu && (
            <SubMenu
              category={category}
              onSelect={onSelect}
              parentRect={itemRef.current?.getBoundingClientRect()}
            />
          )}
        </>
      )}
    </div>
  );
};

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  category?: CategoryType;
  parentId?: string;
  onSuccess: () => void;
}

const ParentCategorySelect = ({ 
  field, 
  categories, 
  excludeId 
}: { 
  field: ControllerRenderProps<CreateCategoryInput | UpdateCategoryInput, "parentId">; 
  categories: CategoryType[]; 
  excludeId?: string;
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  return (
    <FormItem>
      <FormLabel className="text-base font-semibold">Parent Category (Optional)</FormLabel>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between text-base py-5",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value
                ? findCategoryById(categories, field.value)?.title || "Select a parent category"
                : "None (Top level category)"}
              <ChevronDown className={cn(
                "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
                isPopoverOpen && "transform rotate-180"
              )} />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[300px] p-0" 
          align="start"
          sideOffset={4}
        >
          <div className="max-h-[400px] overflow-visible">
            <div
              className={cn(
                "flex items-center justify-between px-4 py-3 text-base cursor-pointer",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                "transition-colors duration-100 border-b"
              )}
              onClick={() => {
                field.onChange(undefined);
                setIsPopoverOpen(false);
              }}
            >
              <span className="font-medium text-zinc-500">None (Top level)</span>
            </div>
            
            {categories.map((cat) => (
              <CategoryMenuItem
                key={cat.id}
                category={cat}
                excludeId={excludeId}
                onSelect={(categoryId) => {
                  field.onChange(categoryId);
                  setIsPopoverOpen(false);
                }}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <FormMessage className="text-sm" />
    </FormItem>
  );
};

export function CategoryModal({ isOpen, onClose, mode, category, parentId, onSuccess }: CategoryModalProps) {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        showToast('error', 'Failed to load categories');
      }
    };
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const form = useForm<CreateCategoryInput | UpdateCategoryInput>({
    resolver: zodResolver(mode === 'add' ? CreateCategorySchema : UpdateCategorySchema),
    defaultValues: {
      title: category?.title || '',
      parentId: parentId || category?.parentId || undefined,
    },
  });

  // Reset form when modal opens or category changes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: category?.title || '',
        parentId: parentId || category?.parentId || undefined,
      });
    }
  }, [isOpen, category, parentId, form]);

  const onSubmit = async (data: CreateCategoryInput | UpdateCategoryInput) => {
    try {
      setIsLoading(true);
      
      if (mode === 'add') {
        await createCategory(data as CreateCategoryInput);
        showToast('success', 'Category created successfully');
      } else {
        if (!category?.id) {
          throw new Error('Category ID is required for update');
        }
        await updateCategory(category.id, data as UpdateCategoryInput);
        showToast('success', 'Category updated successfully');
      }
      
      onSuccess();
      onClose();
      form.reset();
    } catch (error) {
      console.error(`Error ${mode === 'add' ? 'creating' : 'updating'} category:`, error);
      showToast('error', `Failed to ${mode === 'add' ? 'create' : 'update'} category`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {mode === 'add' ? 'Create New Category' : 'Edit Category'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Add a new category to organize your courses' 
              : 'Update the category information'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Category Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter category title" 
                      {...field} 
                      className="text-base py-5"
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <ParentCategorySelect 
                  field={field} 
                  categories={categories} 
                  excludeId={category?.id}
                />
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="text-base px-6 py-5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-base px-6 py-5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {mode === 'add' ? 'Creating...' : 'Updating...'}
                  </div>
                ) : (
                  mode === 'add' ? 'Create Category' : 'Update Category'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
