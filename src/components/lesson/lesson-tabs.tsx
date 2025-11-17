"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type LessonTabId = "overview" | "notes" | "documents" | "files" | "quiz";

interface LessonTabsProps {
  activeTab: LessonTabId;
  onTabChange: (tab: LessonTabId) => void;
}

export function LessonTabs({ activeTab, onTabChange }: LessonTabsProps) {
  const tabs: { id: LessonTabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "notes", label: "Notes" },
    { id: "documents", label: "Documents" },
    { id: "quiz", label: "Quiz" },
  ];

  return (
    <div className="border-b border-border bg-card">
      <div className="flex gap-8 px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "py-4 font-medium text-sm transition-colors relative",
              activeTab === tab.id
                ? "text-orange"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
