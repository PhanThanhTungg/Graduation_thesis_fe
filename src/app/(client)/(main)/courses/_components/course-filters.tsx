"use client"

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { useState } from "react";
import { mockCategories } from "@/lib/mockData";

interface FilterSection {
  title: string;
  items: { label: string; count: number; value: string }[];
}

const categories: FilterSection = {
  title: "Course category",
  items: mockCategories.map((cat) => ({
    label: cat.title,
    count: 15,
    value: cat.slug,
  })),
};

const prices: FilterSection = {
  title: "Price",
  items: [
    { label: "All", count: 15, value: "all" },
    { label: "Free", count: 15, value: "free" },
    { label: "Paid", count: 15, value: "paid" },
  ],
};

function PriceRangeFilter() {
  const [priceFrom, setPriceFrom] = useState<string>("");
  const [priceTo, setPriceTo] = useState<string>("");

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
            onChange={(e) => setPriceFrom(e.target.value)}
            className="flex-1"
            min="0"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="To"
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
            className="flex-1"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}

const levels: FilterSection = {
  title: "Level",
  items: [
    { label: "All levels", count: 15, value: "all" },
    { label: "Beginner", count: 15, value: "beginner" },
    { label: "Intermediate", count: 15, value: "intermediate" },
    { label: "Expert", count: 15, value: "expert" },
  ],
};

const reviews = [
  { stars: 5, count: 1025 },
  { stars: 4, count: 1025 },
  { stars: 3, count: 1025 },
  { stars: 2, count: 1025 },
  { stars: 1, count: 1025 },
];

function FilterGroup({ section }: { section: FilterSection }) {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-foreground capitalize">
        {section.title}
      </h3>
      <div className="flex flex-col gap-2.5">
        {section.items.map((item) => (
          <label
            key={item.value}
            className="flex items-center gap-1 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          >
            <Checkbox
              checked={selected.includes(item.value)}
              onCheckedChange={(checked) => {
                setSelected(
                  checked
                    ? [...selected, item.value]
                    : selected.filter((v) => v !== item.value)
                );
              }}
            />
            <span className="flex-1">{item.label}</span>
            <span>{item.count}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ReviewFilter() {
  const [selected, setSelected] = useState<number[]>([]);

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
                setSelected(
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
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              ({review.count.toLocaleString()})
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function CourseFilters() {
  return (
    <aside className="w-[270px] flex-shrink-0 flex flex-col gap-[30px]">
      <FilterGroup section={categories} />
      <PriceRangeFilter />
      <ReviewFilter />
      <FilterGroup section={levels} />
    </aside>
  );
}
