import {
  getTopCourses,
  getTopTeachers,
  TimePeriod,
  CustomDateRange,
} from "@/lib/admin-dashboard-mock-data";
import { BookOpen, Users, Star, DollarSign, TrendingUp } from "lucide-react";

interface TopCoursesListProps {
  timePeriod: TimePeriod;
  customDateRange?: CustomDateRange;
}

function TopCoursesList({ timePeriod, customDateRange }: TopCoursesListProps) {
  const courses = getTopCourses(timePeriod, customDateRange);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-foreground" />
        <h2 className="text-lg font-bold text-foreground">Top Courses</h2>
      </div>
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div
            key={course.id}
            className="flex items-start gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {course.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {course.teacherName}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(course.revenue)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {course.students} students
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-star" />
                  <span className="text-xs text-muted-foreground">
                    {course.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface TopTeachersListProps {
  timePeriod: TimePeriod;
  customDateRange?: CustomDateRange;
}

function TopTeachersList({
  timePeriod,
  customDateRange,
}: TopTeachersListProps) {
  const teachers = getTopTeachers(timePeriod, customDateRange);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-foreground" />
        <h2 className="text-lg font-bold text-foreground">Top Teachers</h2>
      </div>
      <div className="space-y-4">
        {teachers.map((teacher, index) => (
          <div
            key={teacher.id}
            className="flex items-start gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {teacher.name}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-1">
                {teacher.email}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {teacher.courses} courses
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {teacher.students} students
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(teacher.revenue)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-star" />
                  <span className="text-xs text-muted-foreground">
                    {teacher.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DashboardTopListsProps {
  timePeriod: TimePeriod;
  customDateRange?: CustomDateRange;
}

export default function DashboardTopLists({
  timePeriod,
  customDateRange,
}: DashboardTopListsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TopCoursesList
        timePeriod={timePeriod}
        customDateRange={customDateRange}
      />
      <TopTeachersList
        timePeriod={timePeriod}
        customDateRange={customDateRange}
      />
    </div>
  );
}
