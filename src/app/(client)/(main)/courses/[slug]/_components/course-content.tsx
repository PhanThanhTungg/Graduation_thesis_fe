"use client"

import { useState } from "react";
import { CourseTabs, OverviewTab, CurriculumTab, InstructorTab, FAQsTab, ReviewsTab, CommentForm, type TabId } from "./";
import { TeacherType } from "@/schema/user.schema";
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
        return <ReviewsTab />;
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
