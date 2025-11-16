"use client"

import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "curriculum", label: "Curriculum" },
  { id: "instructor", label: "Instructor" },
  { id: "faqs", label: "FAQs" },
  { id: "reviews", label: "Reviews" },
] as const;

export type TabId = typeof tabs[number]["id"];

interface CourseTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function CourseTabs({ activeTab, onTabChange }: CourseTabsProps) {
  return (
    <div className="flex items-start border border-border rounded-tl-[20px] rounded-tr-[20px] overflow-hidden">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        const isFirst = index === 0;
        const isLast = index === tabs.length - 1;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 px-[20px] py-3 text-base font-semibold capitalize transition-all border-r border-border last:border-r-0",
              isFirst && "rounded-tl-[20px]",
              isLast && "rounded-tr-[20px]",
              isActive
                ? "bg-muted text-green border-l border-t border-b-0"
                : "bg-transparent text-foreground hover:bg-muted/50"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
