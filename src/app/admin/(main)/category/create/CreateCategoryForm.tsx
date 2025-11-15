'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { CreateCategoryInput, CreateCategorySchema, CategoryType } from '@/schema/category.schema';
import { createCategory, getAllCategories } from '@/service/admin/category.service';
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

const ParentCategorySelect = ({ 
  field, 
  categories 
}: { 
  field: ControllerRenderProps<CreateCategoryInput, "parentId">; 
  categories: CategoryType[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <FormItem>
      <FormLabel className="text-base font-semibold">Parent Category (Optional)</FormLabel>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between text-lg py-6",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value
                ? findCategoryById(categories, field.value)?.title || "Select a parent category"
                : "Select a parent category"}
              <ChevronDown className={cn(
                "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
                isOpen && "transform rotate-180"
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
            {categories.map((category) => (
              <CategoryMenuItem
                key={category.id}
                category={category}
                onSelect={(categoryId) => {
                  field.onChange(categoryId);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <FormMessage className="text-base" />
    </FormItem>
  );
};

const CategoryMenuItem = ({ category, onSelect }: CategoryMenuItemProps) => {
  const [showSubMenu, setShowSubMenu] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasChildren = category.children && category.children.length > 0;

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
      }, 100); // Small delay to prevent menu from closing when moving to submenu
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

export function CreateCategoryForm() {
  const router = useRouter();
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
    fetchCategories();
  }, []);

  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      title: '',
    },
  });

  const onSubmit = async (data: CreateCategoryInput) => {
    try {
      setIsLoading(true);
      await createCategory(data);
      showToast('success', 'Category created successfully');
      router.push('/admin/category');
      router.refresh();
    } catch (error) {
      console.error('Error creating category:', error);
      showToast('error', 'Failed to create category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold">Create New Category</CardTitle>
        <p className="text-zinc-500 dark:text-zinc-400">Add a new category to organize your courses</p>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
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
                className="text-lg py-6"
              />
            </FormControl>
            <FormMessage className="text-base" />
          </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <ParentCategorySelect field={field} categories={categories} />
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
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
                  Creating...
                </div>
              ) : (
                'Create Category'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
