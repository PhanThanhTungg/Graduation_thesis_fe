import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Teacher Space",
  description: "Welcome to the Teacher Dashboard",
}

export default async function TeacherDashboardPage() {
  return (
    <div className="container-lg py-12">
      <section className="mb-8">
        <h1 className="font-heading font-semibold text-3xl text-foreground mb-2">Teacher Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Welcome to your dashboard
        </p>
      </section>
    </div>
  )
}