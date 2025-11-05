import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Teacher Space",
  description: "Welcome to the Teacher Dashboard",
}

export default async function TeacherDashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Welcome to your dashboard! Here you can manage your courses, view student progress, and access teaching resources.
      </p>
      {/* Additional dashboard content can be added here */}
    </div>
  )
}