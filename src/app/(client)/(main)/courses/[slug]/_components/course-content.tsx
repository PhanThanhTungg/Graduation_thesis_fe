"use client"

import { useState } from "react";
import { CourseTabs, OverviewTab, CurriculumTab, InstructorTab, FAQsTab, ReviewsTab, type TabId } from "./";
import { ExtendedCourseType } from "@/schema/course.schema";

interface CourseContentProps {
  course: ExtendedCourseType;
}

export default function CourseContent({ course }: CourseContentProps) {
  const [activeTab, setActiveTab] = useState<TabId>("curriculum");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab course={course} />;
      case "curriculum":
        return <CurriculumTab/>;
      case "instructor":
        return <InstructorTab instructor={course.teacher} />;
      case "faqs":
        return <FAQsTab />;
      case "reviews":
        return <ReviewsTab courseId={course.id.toString()} />;
    }
  };

  return (
    <>
      {/* Tabs */}
      <CourseTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {renderTabContent()}
    </>
  );
}
