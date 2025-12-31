"use client";

import { useState } from "react";
import {
  CourseTabs,
  OverviewTab,
  CurriculumTab,
  InstructorTab,
  FAQsTab,
  ReviewsTab,
  type TabId,
} from "./";
import { ExtendedCourseType } from "@/schema/course.schema";
import { CourseCurriculumType } from "@/schema/lesson.schema";

interface CourseContentProps {
  course: ExtendedCourseType;
  curriculum: CourseCurriculumType;
}

export default function CourseContent({
  course,
  curriculum,
}: CourseContentProps) {
  const [activeTab, setActiveTab] = useState<TabId>("curriculum");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab course={course} />;
      case "curriculum":
        return <CurriculumTab curriculum={curriculum} />;
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
      <CourseTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {renderTabContent()}
    </>
  );
}
