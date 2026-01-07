export interface DailyAnalytics {
  date: string;
  revenue: number;
  platformFee: number;
  student: number;
  teacher: number;
}

export interface TeacherAnalytics {
  teacherId: string;
  fullName: string;
  email: string;
  studentCount: number;
  courseCount: number;
  revenue: number;
}

export interface CourseAnalytics {
  courseId: string;
  title: string;
  teacherFullName: string;
  studentCount: number;
  revenue: number;
  rating: number;
}

export interface OverviewAnalytics {
  totalStudents: number;
  totalTeachers: number;
  totalRevenue: number;
  totalCourses: number;
  totalPlatformFee: number;
  revenueByCategory: Record<string, number>;
  top5TeachersByStudentCount: TeacherAnalytics[];
  top5CoursesByStudentCount: CourseAnalytics[];
}

export interface AdminAnalytics {
  dailyAnalytics: DailyAnalytics[];
  overview: OverviewAnalytics;
}
