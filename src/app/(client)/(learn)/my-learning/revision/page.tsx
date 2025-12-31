"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getReviewSpaceLessons } from "@/service/review-space.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  BookOpen,
  Brain,
  Calendar,
  TrendingUp,
  Home,
  Settings,
} from "lucide-react";
import { LearningCalendar } from "./_components/learning-calendar";

export default function RevisionPage() {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    learning: 0,
    reviewing: 0,
    lapsed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // Fetch all lessons to calculate stats
        const response = await getReviewSpaceLessons({
          page: 1,
          limit: 1000, // Get all for stats
        });

        const lessons = response.data;
        const statusCounts = {
          total: lessons.length,
          new: lessons.filter((l) => l.status === "new").length,
          learning: lessons.filter((l) => l.status === "learning").length,
          reviewing: lessons.filter((l) => l.status === "reviewing").length,
          lapsed: lessons.filter((l) => l.status === "lapsed").length,
        };

        setStats(statusCounts);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="py-8 container-sm">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="size-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/my-learning/courses">
              My Learning
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Revision</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Revision</h1>
        <p className="text-muted-foreground">
          Review your lessons using spaced repetition
        </p>
      </div>

      {stats.total === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Brain className="size-16 text-muted-foreground mb-4" />
          <p className="text-2xl font-semibold text-muted-foreground mb-2">
            No lessons in review space
          </p>
          <p className="text-muted-foreground mb-6">
            Add lessons to your review space to start reviewing
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5 text-blue-500" />
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  New
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-blue-500" />
                  <p className="text-3xl font-bold">{stats.new}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Brain className="size-5 text-yellow-500" />
                  <p className="text-3xl font-bold">{stats.learning}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Reviewing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Calendar className="size-5 text-green-500" />
                  <p className="text-3xl font-bold">{stats.reviewing}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <LearningCalendar />

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ready to Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You have {stats.total} lessons in your review space. Start
                reviewing to improve your retention and master the content.
              </p>
              <Link href="/my-learning/revision/lesson">
                <Button size="lg" className="w-full sm:w-auto">
                  <BookOpen className="size-4 mr-2" />
                  View All Lessons
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="size-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Customize your revision settings and preferences.
              </p>
              <Link href="/my-learning/revision/setting">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Settings className="size-4 mr-2" />
                  Configure Settings
                </Button>
              </Link>
            </CardContent>
          </Card>

          {stats.lapsed > 0 && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive">
                  Attention Needed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You have {stats.lapsed} lapsed{" "}
                  {stats.lapsed === 1 ? "lesson" : "lessons"} that need review.
                  These lessons require immediate attention to prevent further
                  forgetting.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
