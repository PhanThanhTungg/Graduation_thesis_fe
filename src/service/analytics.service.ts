import { get } from "@/lib/request";

// Types for analytics data
export type AnalyticsSummary = {
  totalRevenue: number;
  revenueChange: number;
  totalFees: number;
  feesChange: number;
  newStudents: number;
  studentsChange: number;
  activeCourses: number;
  coursesChange: number;
  avgRating: number;
  ratingChange: number;
};

export type AnalyticsMetrics = {
  totalOrders: number;
  totalCourses: number;
  totalLessons: number;
  totalReviews: number;
  totalStudents: number;
};

export type CurrentAnalyticsResponse = {
  message: string;
  data: {
    date: string;
    timezone: string;
    summary: AnalyticsSummary;
    metrics: AnalyticsMetrics;
    chartData?: unknown;
  };
};

export type ChartDataPoint = {
  date: string;
  orders: number;
  revenue: number;
  profit: number;
};

export type ChartDataResponse = {
  message: string;
  data: {
    timeRange: string;
    timezone: string;
    chartData: ChartDataPoint[];
  };
};

export type AnalyticsHistoryItem = {
  id: string;
  date: string;
  timezone: string;
  totalRevenue: number;
  totalFees: number;
  feesChange: number;
  revenueChange: number;
  newStudents: number;
  studentsChange: number;
  activeCourses: number;
  coursesChange: number;
  avgRating: number;
  ratingChange: number;
  totalOrders: number;
  totalUsers: number;
  totalCourses: number;
  totalLessons: number;
  totalReviews: number;
  chartData: unknown;
  createdAt: string;
  userId: string;
};

export type AnalyticsHistoryResponse = {
  message: string;
  data: {
    startDate: string;
    endDate: string;
    timezone: string;
    history: AnalyticsHistoryItem[];
  };
};

/**
 * Get current real-time analytics data
 */
export const getCurrentAnalytics = async (params?: {
  date?: string;
  timezone?: string;
}) => {
  const response = await get<CurrentAnalyticsResponse>(
    "/api/analytics/client/current",
    params
  );

  if (response.status === 200) {
    return (response.payload as CurrentAnalyticsResponse).data;
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to get current analytics"
  );
};

/**
 * Get analytics by date - returns real-time for today, historical for past dates
 */
export const getAnalyticsByDate = async (params?: {
  date?: string;
  timezone?: string;
}) => {
  const response = await get<CurrentAnalyticsResponse>(
    "/api/analytics/client/by-date",
    params
  );

  if (response.status === 200) {
    return (response.payload as CurrentAnalyticsResponse).data;
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to get analytics by date"
  );
};

/**
 * Get historical analytics for a date range
 */
export const getAnalyticsHistory = async (params: {
  startDate: string;
  endDate: string;
  timezone?: string;
}) => {
  const response = await get<AnalyticsHistoryResponse>(
    "/api/analytics/client/history",
    params
  );

  if (response.status === 200) {
    return (response.payload as AnalyticsHistoryResponse).data;
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to get analytics history"
  );
};

/**
 * Get chart data for orders/revenue over time
 */
export const getChartData = async (params?: {
  timeRange?: "7d" | "30d" | "90d";
  timezone?: string;
}) => {
  const response = await get<ChartDataResponse>(
    "/api/analytics/client/chart",
    params
  );

  if (response.status === 200) {
    return (response.payload as ChartDataResponse).data;
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to get chart data"
  );
};

// New types for additional endpoints
export type TopCourse = {
  id: string;
  name: string;
  revenue: number;
  rating: number;
  students: number;
};

export type TopCoursesResponse = {
  message: string;
  data: TopCourse[];
};

export type StudentsByCountry = {
  country: string;
  count: number;
};

export type StudentsByCountryResponse = {
  message: string;
  data: StudentsByCountry[];
};

export type CourseRatingHistoryDataPoint = {
  date: string;
  rating: number;
  reviews: number;
};

export type CourseRatingHistoryResponse = {
  message: string;
  data: {
    courseId: string;
    courseName: string;
    timeRange: string;
    chartData: CourseRatingHistoryDataPoint[];
  };
};

/**
 * Get top 5 courses by revenue
 */
export const getTopCourses = async () => {
  const response = await get<TopCoursesResponse>(
    "/api/analytics/client/top-courses",
    undefined
  );

  if (response.status === 200) {
    return (response.payload as TopCoursesResponse).data;
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to get top courses"
  );
};

/**
 * Get students distribution by country
 */
export const getStudentsByCountry = async () => {
  const response = await get<StudentsByCountryResponse>(
    "/api/analytics/client/students-by-country",
    undefined
  );

  if (response.status === 200) {
    return (response.payload as StudentsByCountryResponse).data;
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to get students by country"
  );
};

/**
 * Get course rating and review history
 */
export const getCourseRatingHistory = async (params: {
  courseId: string;
  timeRange?: "7d" | "30d" | "90d";
  timezone?: string;
}) => {
  // Validate courseId before making API call
  if (!params.courseId || params.courseId.trim() === '') {
    throw new Error("Course ID is required");
  }

  const response = await get<CourseRatingHistoryResponse>(
    "/api/analytics/client/course-rating-history",
    params
  );

  if (response.status === 200) {
    return (response.payload as CourseRatingHistoryResponse).data;
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to get course rating history"
  );
};

export type CourseOption = {
  id: string;
  name: string;
};

export type CourseItem = {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  price: number;
  rating: number;
  countStudent: number;
};

export type CourseListResponse = {
  message: string;
  data: {
    items: CourseItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

/**
 * Get list of teacher's courses for dropdown
 * Using existing course endpoint
 */
export const getCourseList = async () => {
  const response = await get<CourseListResponse>(
    "/api/course/teacher-area/my-courses",
    { limit: 1000 } // Get all courses without pagination
  );

  if (response.status === 200) {
    const items = (response.payload as CourseListResponse).data.items;
    return items.map(course => ({
      id: course.id,
      name: course.title
    }));
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to get course list"
  );
};


