"use client";

import type { ReactNode } from "react";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/sidebar";
import TopNav from "@/components/admin/top-nav";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`flex h-screen overflow-hidden ${theme === "dark" ? "dark" : ""}`}
    >
      <Sidebar />
      <div className="w-full flex flex-1 flex-col ml-0 lg:ml-64 overflow-hidden">
        <header className="sticky top-0 z-50 h-16 border-b border-gray-200 dark:border-[#1F1F23] bg-white dark:bg-[#0F0F12] shrink-0">
          <TopNav />
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-white dark:bg-[#0F0F12]">
          {children}
        </main>
      </div>
    </div>
  );
}
