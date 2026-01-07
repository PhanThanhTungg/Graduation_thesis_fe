"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Users, GraduationCap, DollarSign, BookOpen, TrendingUp, Trophy, Medal, Award, Star, Crown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getAdminAnalytics } from "@/service/admin/analytics.service";
import { AdminAnalytics } from "@/interfaces/admin-analytics.interface";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const startDate = format(dateRange.from, "yyyy-MM-dd");
    const endDate = format(dateRange.to, "yyyy-MM-dd");
    const result = await getAdminAnalytics(startDate, endDate);
    setData(result);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Prepare chart data
  const dailyChartData = data.dailyAnalytics.map((item) => ({
    date: format(new Date(item.date), "MMM dd"),
    revenue: item.revenue,
    platformFee: item.platformFee,
    students: item.student,
    teachers: item.teacher,
  }));

  const categoryChartData = Object.entries(data.overview.revenueByCategory).map(([categoryName, revenue]) => ({
    category: categoryName,
    revenue,
  }));

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Date Range Picker */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from && dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to });
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalStudents.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Teachers</CardTitle>
            <GraduationCap className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalTeachers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
            <BookOpen className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalCourses.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.overview.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Platform Fee</CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.overview.totalPlatformFee.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Daily Revenue & Platform Fee Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue & Platform Fee</CardTitle>
            <CardDescription>Revenue and platform fee trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
                platformFee: {
                  label: "Platform Fee",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="platformFee" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Daily Students & Teachers Chart */}
        <Card>
          <CardHeader>
            <CardTitle>New Users</CardTitle>
            <CardDescription>Daily new students and teachers</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                students: {
                  label: "Students",
                  color: "hsl(var(--chart-3))",
                },
                teachers: {
                  label: "Teachers",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="students" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="teachers" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue by Category Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>Revenue distribution across course categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="category" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#6b7280" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top 5 Teachers Leaderboard */}
        <Card className="border-t-4 border-t-purple-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-600" />
              <CardTitle>Top 5 Teachers</CardTitle>
            </div>
            <CardDescription>Teachers ranked by student count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.overview.top5TeachersByStudentCount.map((teacher, index) => {
                const getRankIcon = (rank: number) => {
                  if (rank === 0) return <Crown className="h-6 w-6 text-yellow-500" />;
                  if (rank === 1) return <Medal className="h-6 w-6 text-gray-400" />;
                  if (rank === 2) return <Award className="h-6 w-6 text-amber-700" />;
                  return <div className="h-6 w-6 flex items-center justify-center font-bold text-muted-foreground">#{rank + 1}</div>;
                };
                
                const getRankBg = (rank: number) => {
                  if (rank === 0) return "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 border-l-4 border-l-yellow-500";
                  if (rank === 1) return "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950 dark:to-slate-950 border-l-4 border-l-gray-400";
                  if (rank === 2) return "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border-l-4 border-l-amber-700";
                  return "bg-muted/50 border-l-2 border-l-muted-foreground/20";
                };

                return (
                  <div key={teacher.teacherId} className={cn("p-4 rounded-lg transition-all hover:shadow-md", getRankBg(index))}>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {getRankIcon(index)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-base truncate">{teacher.fullName}</h4>
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
                            <DollarSign className="h-4 w-4" />
                            <span>{teacher.revenue.toLocaleString()}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mb-2">{teacher.email}</p>
                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="font-medium">{teacher.studentCount}</span>
                            <span className="text-muted-foreground">students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            <span className="font-medium">{teacher.courseCount}</span>
                            <span className="text-muted-foreground">courses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top 5 Courses Leaderboard */}
        <Card className="border-t-4 border-t-orange-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-orange-600" />
              <CardTitle>Top 5 Courses</CardTitle>
            </div>
            <CardDescription>Courses ranked by student count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.overview.top5CoursesByStudentCount.map((course, index) => {
                const getRankIcon = (rank: number) => {
                  if (rank === 0) return <Crown className="h-6 w-6 text-yellow-500" />;
                  if (rank === 1) return <Medal className="h-6 w-6 text-gray-400" />;
                  if (rank === 2) return <Award className="h-6 w-6 text-amber-700" />;
                  return <div className="h-6 w-6 flex items-center justify-center font-bold text-muted-foreground">#{rank + 1}</div>;
                };
                
                const getRankBg = (rank: number) => {
                  if (rank === 0) return "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 border-l-4 border-l-yellow-500";
                  if (rank === 1) return "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950 dark:to-slate-950 border-l-4 border-l-gray-400";
                  if (rank === 2) return "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border-l-4 border-l-amber-700";
                  return "bg-muted/50 border-l-2 border-l-muted-foreground/20";
                };

                return (
                  <div key={course.courseId} className={cn("p-4 rounded-lg transition-all hover:shadow-md", getRankBg(index))}>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {getRankIcon(index)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-base truncate">{course.title}</h4>
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
                            <DollarSign className="h-4 w-4" />
                            <span>{course.revenue.toLocaleString()}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mb-2">by {course.teacherFullName}</p>
                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="font-medium">{course.studentCount}</span>
                            <span className="text-muted-foreground">students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400 fill-yellow-600 dark:fill-yellow-400" />
                            <span className="font-medium">{course.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground">rating</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
