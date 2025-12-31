"use client";

import { useState } from "react";
import { MyLearningSidebar, MyLearningMenuButton } from "./my-learning-sidebar";

export function MyLearningWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <MyLearningSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex-1">
        <MyLearningMenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="max-w-[1200px] mx-auto">{children}</div>
      </div>
    </div>
  );
}
