import { Metadata } from "next";
import SummaryCards from "@/components/teacher/dashboard/SummaryCards";
import RevenueChart from "@/components/teacher/dashboard/RevenueChart";
import TopCoursesTable from "@/components/teacher/dashboard/TopCoursesTable";
import StudentsByCountryChart from "@/components/teacher/dashboard/StudentsByCountryChart";
import CourseRatingReviewsChart from "@/components/teacher/dashboard/CourseRatingReviewsChart";

export const metadata: Metadata = {
  title: "Dashboard - Teacher Space",
  description: "Welcome to the Teacher Dashboard",
}

export default async function TeacherDashboardPage() {

  return (
    <div className="w-full py-12 px-4 md:px-6 lg:px-8">
      <section className="mb-8">
        <h1 className="font-heading font-semibold text-3xl text-foreground mb-2">Teacher Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Welcome to your dashboard. Track your courses, revenue, and student engagement in real-time.
        </p>
      </section>

      {/* Summary Cards */}
      <section className="mb-8">
        <SummaryCards />
      </section>

      {/* Revenue & Profit Chart */}
      <section className="mb-8">
        <RevenueChart />
      </section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Courses Table */}
        <section>
          <TopCoursesTable />
        </section>

        {/* Students by Country Chart */}
        <section>
          <StudentsByCountryChart />
        </section>
      </div>

      {/* Course Rating & Reviews Chart */}
      <section className="mb-8">
        <CourseRatingReviewsChart />
      </section>
    </div>
  )
}