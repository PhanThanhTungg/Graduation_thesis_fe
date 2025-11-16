'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CategoryType } from '@/schema/category.schema';
import { ChevronDown, Pencil, Trash2, Plus, FolderTree } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryItemProps {
  category: CategoryType;
  level?: number;
  onAdd?: (parentId: string) => void;
  onEdit?: (category: CategoryType) => void;
  onDelete?: (category: CategoryType) => void;
}

const getBgColor = (level: number) => {
  const colors = [
    'bg-white dark:bg-zinc-900',
    'bg-blue-50 dark:bg-zinc-800',
    'bg-green-50 dark:bg-zinc-700',
    'bg-purple-50 dark:bg-zinc-600'
  ];
  return colors[level % colors.length];
};

export function CategoryItem({ category, level = 0, onAdd, onEdit, onDelete }: CategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="category-item w-full">
      <div 
        className={cn(
          "p-4 rounded-lg group cursor-pointer",
          "border border-zinc-200 dark:border-zinc-700",
          "transition-all duration-200 hover:shadow-md",
          getBgColor(level)
        )}
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderTree size={20} className={cn(
              "transition-colors duration-200",
              level === 0 ? "text-blue-500" :
              level === 1 ? "text-green-500" :
              "text-purple-500"
            )} />
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                {category.title}
              </h3>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {(category.children?.length ?? 0)} subcategories
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd?.(category.id);
                }}
              >
                <Plus size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(category);
                }}
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(category);
                }}
              >
                <Trash2 size={16} />
              </Button>
            </div>
            {hasChildren && (
              <div className={cn(
                "text-zinc-400 transition-transform duration-200",
                isExpanded ? "transform rotate-180" : ""
              )}>
                <ChevronDown size={20} />
              </div>
            )}
          </div>
        </div>
      </div>

      {hasChildren && (
        <div className={cn(
          "grid gap-4 mt-4 ml-8",
          "transition-all duration-200 ease-in-out",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}>
          <div className="overflow-hidden">
            <div className="grid gap-4">
              {category.children?.map((child) => (
                <CategoryItem    
                  key={child.id}
                  category={child}
                  level={level + 1}
                  onAdd={onAdd}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

