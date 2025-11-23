import { Metadata } from "next";
import StudentManagementContent from "@/app/(client)/teacher/students/_components/StudentManagementContent";

export const metadata: Metadata = {
  title: "Student Management - Teacher Space",
  description: "View student list and their learning progress",
};

export default function TeacherStudentsPage() {
  return <StudentManagementContent />;
}
