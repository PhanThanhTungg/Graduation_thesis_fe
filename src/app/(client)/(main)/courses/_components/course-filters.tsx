"use client"

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryType } from "@/schema/category.schema";

interface CourseFiltersProps {
  categories: CategoryType[];
}

function PriceRangeFilter({ 
  priceFrom, 
  priceTo, 
  onPriceFromChange, 
  onPriceToChange 
}: { 
  priceFrom: string; 
  priceTo: string; 
  onPriceFromChange: (value: string) => void; 
  onPriceToChange: (value: string) => void; 
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-foreground capitalize">
        Price Range
      </h3>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="From"
            value={priceFrom}
            onChange={(e) => onPriceFromChange(e.target.value)}
            className="flex-1"
            min="0"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="To"
            value={priceTo}
            onChange={(e) => onPriceToChange(e.target.value)}
            className="flex-1"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}

const reviews = [
  { stars: 5 },
  { stars: 4 },
  { stars: 3 },
  { stars: 2 },
  { stars: 1 },
];

function CategoryFilter({ 
  categories, 
  selected, 
  onSelectedChange 
}: { 
  categories: CategoryType[]; 
  selected: string[]; 
  onSelectedChange: (categoryIds: string[]) => void; 
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-foreground capitalize">
        Course Category
      </h3>
      <div className="flex flex-col gap-2.5">
        {categories.map((category) => (
          <label
            key={category.id}
            className="flex items-center gap-1 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          >
            <Checkbox
              checked={selected.includes(category.id)}
              onCheckedChange={(checked) => {
                onSelectedChange(
                  checked
                    ? [...selected, category.id]
                    : selected.filter((v) => v !== category.id)
                );
              }}
            />
            <span className="flex-1">{category.title}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ReviewFilter({ 
  selected, 
  onSelectedChange 
}: { 
  selected: number[]; 
  onSelectedChange: (ratings: number[]) => void; 
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-foreground capitalize">
        Review
      </h3>
      <div className="flex flex-col gap-1">
        {reviews.map((review) => (
          <label
            key={review.stars}
            className="flex items-center gap-1 cursor-pointer group"
          >
            <Checkbox
              checked={selected.includes(review.stars)}
              onCheckedChange={(checked) => {
                onSelectedChange(
                  checked
                    ? [...selected, review.stars]
                    : selected.filter((v) => v !== review.stars)
                );
              }}
            />
            <div className="flex-1 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${
                    i < review.stars
                      ? "fill-star text-star"
                      : "fill-none text-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function CourseFilters({ categories }: CourseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const categoryIds = searchParams.get('categoryIds');
    return categoryIds ? categoryIds.split(',') : [];
  });

  const [selectedRatings, setSelectedRatings] = useState<number[]>(() => {
    const ratings = searchParams.get('ratings');
    return ratings ? ratings.split(',').map(Number) : [];
  });

  const [priceFrom, setPriceFrom] = useState<string>(() => {
    return searchParams.get('priceFrom') || '';
  });

  const [priceTo, setPriceTo] = useState<string>(() => {
    return searchParams.get('priceTo') || '';
  });

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset to page 1 when filtering
    params.set('page', '1');

    // Category filter
    if (selectedCategories.length > 0) {
      params.set('categoryIds', selectedCategories.join(','));
    } else {
      params.delete('categoryIds');
    }

    // Rating filter
    if (selectedRatings.length > 0) {
      params.set('ratings', selectedRatings.join(','));
    } else {
      params.delete('ratings');
    }

    // Price filter
    if (priceFrom) {
      params.set('priceFrom', priceFrom);
    } else {
      params.delete('priceFrom');
    }

    if (priceTo) {
      params.set('priceTo', priceTo);
    } else {
      params.delete('priceTo');
    }

    router.push(`/courses?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedRatings([]);
    setPriceFrom('');
    setPriceTo('');
    router.push('/courses?page=1');
  };

  return (
    <aside className="w-[270px] flex-shrink-0 flex flex-col gap-[30px]">
      <CategoryFilter 
        categories={categories}
        selected={selectedCategories}
        onSelectedChange={setSelectedCategories}
      />
      
      <PriceRangeFilter 
        priceFrom={priceFrom}
        priceTo={priceTo}
        onPriceFromChange={setPriceFrom}
        onPriceToChange={setPriceTo}
      />
      
      <ReviewFilter 
        selected={selectedRatings}
        onSelectedChange={setSelectedRatings}
      />

      <div className="flex flex-col gap-2">
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Clear Filters
        </Button>
      </div>
    </aside>
  );
}
