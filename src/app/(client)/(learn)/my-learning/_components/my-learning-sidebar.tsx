"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, FileText, RefreshCw, BarChart2, Menu } from "lucide-react";

interface Tab {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const tabs: Tab[] = [
  { label: "My courses", href: "courses", icon: BookOpen },
  { label: "My notes", href: "notes", icon: FileText },
  { label: "Revision", href: "revision", icon: RefreshCw },
  { label: "Analyze", href: "analyze", icon: BarChart2 },
];

interface MyLearningSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function MyLearningSidebar({
  isOpen,
  setIsOpen,
}: MyLearningSidebarProps) {
  const pathname = usePathname() || "";

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  const getActive = (href: string) => {
    return pathname.includes(href);
  };

  return (
    <>
      <aside
        className={`w-72 border-r border-border bg-background p-4 flex flex-col gap-4 transform transition-transform duration-200
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:block
        fixed inset-y-0 left-0 z-50 lg:inset-auto`}
      >
        <div className="px-1">
          <ScrollArea className="max-h-[60vh]">
            <nav className="flex flex-col gap-2">
              {tabs.map((t, idx) => {
                const active = getActive(t.href);
                const Icon = t.icon;
                const tabIndex = idx + 1;
                return (
                  <Link
                    key={t.href}
                    href={`./${t.href}`}
                    className={`group flex items-center gap-3 p-2 rounded-lg transition-all duration-150
                      ${active ? "bg-green-foreground" : "hover:bg-accent/10"}
                      `}
                    aria-current={active ? "page" : undefined}
                    tabIndex={tabIndex}
                    onClick={() => setIsOpen(false)}
                  >
                    <span
                      className={`p-2 rounded-md flex items-center justify-center
                        ${active ? "bg-green" : "bg-transparent"} `}
                      aria-hidden
                    >
                      <Icon
                        className={`w-5 h-5 ${active ? "text-muted" : "text-muted-foreground group-hover:text-accent-foreground"}`}
                      />
                    </span>

                    <div className="flex-1">
                      <div
                        className={`text-sm font-medium ${active ? "text-green" : ""}`}
                      >
                        {t.label}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}
    </>
  );
}

export function MyLearningMenuButton({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <div className="sticky top-0 h-10 container-md flex items-center justify-end w-full z-30">
      <button
        aria-label="Open menu"
        className="lg:hidden bg-card/90 p-2 rounded-lg shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-5 h-5" />
      </button>
    </div>
  );
}
