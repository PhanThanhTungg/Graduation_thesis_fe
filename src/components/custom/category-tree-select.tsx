"use client"

import React, { useState, useMemo } from "react"
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CategoryType } from "@/schema/category.schema"
import { cn } from "@/lib/utils"

const isLeafCategory = (category: CategoryType): boolean => {
  return !category.children || category.children.length === 0
}

const getCategoryPath = (categories: CategoryType[], targetId: string, path: string[] = []): string[] | null => {
  for (const category of categories) {
    const currentPath = [...path, category.title]
    
    if (category.id === targetId) {
      return currentPath
    }
    
    if (category.children && category.children.length > 0) {
      const found = getCategoryPath(category.children, targetId, currentPath)
      if (found) {
        return found
      }
    }
  }
  return null
}

interface CategoryTreeNodeProps {
  category: CategoryType
  level: number
  selectedId: string | undefined
  onSelect: (categoryId: string) => void
}

function CategoryTreeNode({ category, level, selectedId, onSelect }: CategoryTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = category.children && category.children.length > 0
  const isLeaf = isLeafCategory(category)
  const isSelected = selectedId === category.id

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
  }

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLeaf) {
      onSelect(category.id)
    }
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-2 px-3 rounded-md transition-colors",
          isSelected && "bg-primary/10 text-primary",
          !isSelected && "hover:bg-muted/50",
          "cursor-pointer"
        )}
        style={{ paddingLeft: `${level * 1.5}rem` }}
        onClick={isLeaf ? handleSelect : handleToggle}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleToggle(e)
          }}
          className={cn(
            "flex-shrink-0 p-1 rounded transition-colors",
            hasChildren ? "hover:bg-muted cursor-pointer" : "cursor-default"
          )}
        >
          {hasChildren ? (
            isExpanded ? (
              <IconChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <IconChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          ) : (
            <span className="w-4 h-4" />
          )}
        </button>
        <span className="flex-1">
          {category.title}
        </span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {category.children?.map((child) => (
            <CategoryTreeNode
              key={child.id}
              category={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CategoryTreeSelectProps {
  categories: CategoryType[]
  value: string | undefined
  onValueChange: (value: string) => void
  placeholder?: string
}

export function CategoryTreeSelect({ categories, value, onValueChange, placeholder = "Select a category" }: CategoryTreeSelectProps) {
  const [open, setOpen] = useState(false)
  
  const selectedCategory = useMemo(() => {
    if (!value) return null
    
    const findCategory = (cats: CategoryType[]): CategoryType | null => {
      for (const cat of cats) {
        if (cat.id === value) return cat
        if (cat.children) {
          const found = findCategory(cat.children)
          if (found) return found
        }
      }
      return null
    }
    
    return findCategory(categories)
  }, [categories, value])

  const displayValue = selectedCategory
    ? (getCategoryPath(categories, selectedCategory.id)?.join(" > ") || selectedCategory.title)
    : placeholder

  const handleSelect = (categoryId: string) => {
    onValueChange(categoryId)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <span className="truncate">{displayValue}</span>
          <IconChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <div className="max-h-[300px] overflow-y-auto p-2">
          {categories.map((category) => (
            <CategoryTreeNode
              key={category.id}
              category={category}
              level={0}
              selectedId={value}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

