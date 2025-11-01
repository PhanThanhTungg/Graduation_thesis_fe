"use client"

import { useState } from "react";
import { CourseTabs, OverviewTab, CurriculumTab, InstructorTab, FAQsTab, ReviewsTab, CommentForm, type TabId } from "./";
import { TeacherType } from "@/schema/user.schema";

interface CourseContentProps {
  instructor: TeacherType;
}

export default function CourseContent({ instructor }: CourseContentProps) {
  const [activeTab, setActiveTab] = useState<TabId>("curriculum");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "curriculum":
        return <CurriculumTab />;
      case "instructor":
        return <InstructorTab instructor={instructor} />;
      case "faqs":
        return <FAQsTab />;
      case "reviews":
        return <ReviewsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <>
      {/* Tabs */}
      <CourseTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {renderTabContent()}

      {/* Comment Form */}
      <CommentForm />
    </>
  );
}
