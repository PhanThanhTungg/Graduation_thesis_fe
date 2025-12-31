export interface AdminSummaryData {
  totalRevenue: number;
  revenueChange: number;
  totalUsers: number;
  usersChange: number;
  totalStudents: number;
  studentsChange: number;
  totalTeachers: number;
  teachersChange: number;
  totalCourses: number;
  coursesChange: number;
  totalOrders: number;
  ordersChange: number;
  avgRating: number;
  ratingChange: number;
  platformFees: number;
  feesChange: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  orders: number;
}

export interface UserGrowthData {
  date: string;
  students: number;
  teachers: number;
  total: number;
}

export interface CourseStatsData {
  date: string;
  published: number;
  unpublished: number;
  total: number;
}

export interface RecentOrder {
  id: string;
  courseTitle: string;
  studentName: string;
  amount: number;
  status: "success" | "processing" | "cancelled";
  createdAt: string;
}

export interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher";
  status: "active" | "inactive" | "banned";
  createdAt: string;
}

export interface RecentCourse {
  id: string;
  title: string;
  teacherName: string;
  price: number;
  isPublished: boolean;
  createdAt: string;
}

export interface TopCourse {
  id: string;
  title: string;
  teacherName: string;
  revenue: number;
  students: number;
  rating: number;
  price: number;
}

export interface TopTeacher {
  id: string;
  name: string;
  email: string;
  courses: number;
  students: number;
  revenue: number;
  rating: number;
}

export type TimePeriod =
  | "today"
  | "7d"
  | "30d"
  | "90d"
  | "365d"
  | "all"
  | "custom";

export interface CustomDateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const getDaysFromPeriod = (
  period: TimePeriod,
  customDateRange?: CustomDateRange,
): number => {
  if (period === "custom" && customDateRange?.from && customDateRange?.to) {
    const diffTime = Math.abs(
      customDateRange.to.getTime() - customDateRange.from.getTime(),
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }

  switch (period) {
    case "today":
      return 1;
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "90d":
      return 90;
    case "365d":
      return 365;
    case "all":
      return 1095;
    default:
      return 30;
  }
};

export const getAdminSummaryData = (
  timePeriod: TimePeriod = "30d",
  customDateRange?: CustomDateRange,
): AdminSummaryData => {
  const days = getDaysFromPeriod(timePeriod, customDateRange);
  const multiplier = days / 30;

  return {
    totalRevenue: Math.round(1250000 * multiplier),
    revenueChange: 18.5,
    totalUsers: Math.round(8542 * multiplier),
    usersChange: 12.3,
    totalStudents: Math.round(7234 * multiplier),
    studentsChange: 14.2,
    totalTeachers: Math.round(1308 * multiplier),
    teachersChange: 8.7,
    totalCourses: Math.round(342 * multiplier),
    coursesChange: 5.6,
    totalOrders: Math.round(4567 * multiplier),
    ordersChange: 22.1,
    avgRating: 4.6,
    ratingChange: 2.3,
    platformFees: Math.round(125000 * multiplier),
    feesChange: 18.5,
  };
};

export const getRevenueChartData = (
  timePeriod: TimePeriod = "30d",
  customDateRange?: CustomDateRange,
): RevenueChartData[] => {
  const days = getDaysFromPeriod(timePeriod, customDateRange);
  const data: RevenueChartData[] = [];

  let startDate: Date;
  let endDate: Date = new Date();

  if (timePeriod === "custom" && customDateRange?.from && customDateRange?.to) {
    startDate = new Date(customDateRange.from);
    endDate = new Date(customDateRange.to);
  } else {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
  }

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const baseRevenue = 30000 + Math.random() * 20000;
    const baseOrders = 50 + Math.floor(Math.random() * 100);

    data.push({
      date: currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      revenue: Math.round(baseRevenue),
      orders: baseOrders,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

export const getUserGrowthData = (
  timePeriod: TimePeriod = "30d",
  customDateRange?: CustomDateRange,
): UserGrowthData[] => {
  const days = getDaysFromPeriod(timePeriod, customDateRange);
  const data: UserGrowthData[] = [];

  let startDate: Date;
  let endDate: Date = new Date();

  if (timePeriod === "custom" && customDateRange?.from && customDateRange?.to) {
    startDate = new Date(customDateRange.from);
    endDate = new Date(customDateRange.to);
  } else {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
  }

  let cumulativeStudents = 6500;
  let cumulativeTeachers = 1200;
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const newStudents = Math.floor(Math.random() * 50) + 10;
    const newTeachers = Math.floor(Math.random() * 5) + 1;

    cumulativeStudents += newStudents;
    cumulativeTeachers += newTeachers;

    data.push({
      date: currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      students: cumulativeStudents,
      teachers: cumulativeTeachers,
      total: cumulativeStudents + cumulativeTeachers,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

export const getCourseStatsData = (
  timePeriod: TimePeriod = "30d",
  customDateRange?: CustomDateRange,
): CourseStatsData[] => {
  const days = getDaysFromPeriod(timePeriod, customDateRange);
  const data: CourseStatsData[] = [];

  let startDate: Date;
  let endDate: Date = new Date();

  if (timePeriod === "custom" && customDateRange?.from && customDateRange?.to) {
    startDate = new Date(customDateRange.from);
    endDate = new Date(customDateRange.to);
  } else {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
  }

  let cumulativePublished = 300;
  let cumulativeUnpublished = 20;
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const newPublished = Math.floor(Math.random() * 3);
    const newUnpublished = Math.floor(Math.random() * 2);

    cumulativePublished += newPublished;
    cumulativeUnpublished += newUnpublished;

    data.push({
      date: currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      published: cumulativePublished,
      unpublished: cumulativeUnpublished,
      total: cumulativePublished + cumulativeUnpublished,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

export const getRecentOrders = (): RecentOrder[] => {
  const courses = [
    "Advanced React & Next.js Development",
    "Full Stack Web Development Bootcamp",
    "Python for Data Science & Machine Learning",
    "UI/UX Design Masterclass",
    "Mobile App Development with Flutter",
    "Node.js Backend Development",
    "DevOps & Cloud Computing",
    "Cybersecurity Fundamentals",
  ];

  const students = [
    "John Smith",
    "Emily Johnson",
    "Michael Brown",
    "Sarah Davis",
    "David Wilson",
    "Jessica Martinez",
    "Christopher Anderson",
    "Amanda Taylor",
    "Matthew Thomas",
    "Ashley Jackson",
    "Daniel White",
    "Jennifer Harris",
  ];

  const statuses: ("success" | "processing" | "cancelled")[] = [
    "success",
    "processing",
    "cancelled",
  ];

  const orders: RecentOrder[] = [];
  const now = new Date();

  for (let i = 0; i < 10; i++) {
    const date = new Date(now);
    date.setHours(date.getHours() - i * 2);

    orders.push({
      id: `order-${i + 1}`,
      courseTitle: courses[Math.floor(Math.random() * courses.length)],
      studentName: students[Math.floor(Math.random() * students.length)],
      amount: Math.round((50 + Math.random() * 200) * 100) / 100,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: date.toISOString(),
    });
  }

  return orders;
};

export const getRecentUsers = (): RecentUser[] => {
  const names = [
    "Alex Thompson",
    "Maria Garcia",
    "James Lee",
    "Sophia Chen",
    "Robert Kim",
    "Olivia Rodriguez",
    "William Patel",
    "Emma Singh",
    "Joseph Kumar",
    "Isabella Wang",
    "Charles Zhang",
    "Mia Anderson",
  ];

  const roles: ("student" | "teacher")[] = ["student", "teacher"];
  const statuses: ("active" | "inactive" | "banned")[] = [
    "active",
    "inactive",
    "banned",
  ];

  const users: RecentUser[] = [];
  const now = new Date();

  for (let i = 0; i < 10; i++) {
    const date = new Date(now);
    date.setHours(date.getHours() - i * 3);
    const name = names[Math.floor(Math.random() * names.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];

    users.push({
      id: `user-${i + 1}`,
      name,
      email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
      role,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: date.toISOString(),
    });
  }

  return users;
};

export const getRecentCourses = (): RecentCourse[] => {
  const courses = [
    "Advanced React & Next.js Development",
    "Full Stack Web Development Bootcamp",
    "Python for Data Science & Machine Learning",
    "UI/UX Design Masterclass",
    "Mobile App Development with Flutter",
    "Node.js Backend Development",
    "DevOps & Cloud Computing",
    "Cybersecurity Fundamentals",
    "Machine Learning with TensorFlow",
    "Blockchain Development Basics",
  ];

  const teachers = [
    "John Doe",
    "Jane Smith",
    "Robert Johnson",
    "Emily Davis",
    "Michael Brown",
    "Sarah Wilson",
    "David Martinez",
    "Jessica Anderson",
  ];

  const courseList: RecentCourse[] = [];
  const now = new Date();

  for (let i = 0; i < 10; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    courseList.push({
      id: `course-${i + 1}`,
      title: courses[Math.floor(Math.random() * courses.length)],
      teacherName: teachers[Math.floor(Math.random() * teachers.length)],
      price: Math.round((50 + Math.random() * 200) * 100) / 100,
      isPublished: Math.random() > 0.3,
      createdAt: date.toISOString(),
    });
  }

  return courseList;
};

export const getTopCourses = (
  timePeriod: TimePeriod = "30d",
  customDateRange?: CustomDateRange,
): TopCourse[] => {
  const days = getDaysFromPeriod(timePeriod, customDateRange);
  const multiplier = days / 30;
  return [
    {
      id: "1",
      title: "Advanced React & Next.js Development",
      teacherName: "John Doe",
      revenue: Math.round(125000 * multiplier),
      students: Math.round(1250 * multiplier),
      rating: 4.8,
      price: 99.99,
    },
    {
      id: "2",
      title: "Full Stack Web Development Bootcamp",
      teacherName: "Jane Smith",
      revenue: Math.round(98000 * multiplier),
      students: Math.round(980 * multiplier),
      rating: 4.7,
      price: 149.99,
    },
    {
      id: "3",
      title: "Python for Data Science & Machine Learning",
      teacherName: "Robert Johnson",
      revenue: Math.round(87000 * multiplier),
      students: Math.round(870 * multiplier),
      rating: 4.9,
      price: 119.99,
    },
    {
      id: "4",
      title: "UI/UX Design Masterclass",
      teacherName: "Emily Davis",
      revenue: Math.round(75000 * multiplier),
      students: Math.round(750 * multiplier),
      rating: 4.6,
      price: 89.99,
    },
    {
      id: "5",
      title: "Mobile App Development with Flutter",
      teacherName: "Michael Brown",
      revenue: Math.round(68000 * multiplier),
      students: Math.round(680 * multiplier),
      rating: 4.5,
      price: 109.99,
    },
  ];
};

export const getTopTeachers = (
  timePeriod: TimePeriod = "30d",
  customDateRange?: CustomDateRange,
): TopTeacher[] => {
  const days = getDaysFromPeriod(timePeriod, customDateRange);
  const multiplier = days / 30;
  return [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      courses: 12,
      students: Math.round(3500 * multiplier),
      revenue: Math.round(350000 * multiplier),
      rating: 4.8,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      courses: 8,
      students: Math.round(2800 * multiplier),
      revenue: Math.round(280000 * multiplier),
      rating: 4.7,
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      courses: 15,
      students: Math.round(4200 * multiplier),
      revenue: Math.round(420000 * multiplier),
      rating: 4.9,
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      courses: 10,
      students: Math.round(2400 * multiplier),
      revenue: Math.round(240000 * multiplier),
      rating: 4.6,
    },
    {
      id: "5",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      courses: 7,
      students: Math.round(1900 * multiplier),
      revenue: Math.round(190000 * multiplier),
      rating: 4.5,
    },
  ];
};

export interface OrdersByStatus {
  name: string;
  value: number;
}

export interface RevenueByCategory {
  name: string;
  revenue: number;
}

export const getOrdersByStatus = (
  timePeriod: TimePeriod = "30d",
  customDateRange?: CustomDateRange,
): OrdersByStatus[] => {
  const days = getDaysFromPeriod(timePeriod, customDateRange);
  const multiplier = days / 30;

  return [
    { name: "Success", value: Math.round(3850 * multiplier) },
    { name: "Processing", value: Math.round(520 * multiplier) },
    { name: "Cancelled", value: Math.round(197 * multiplier) },
  ];
};

export const getRevenueByCategory = (
  timePeriod: TimePeriod = "30d",
  customDateRange?: CustomDateRange,
): RevenueByCategory[] => {
  const days = getDaysFromPeriod(timePeriod, customDateRange);
  const multiplier = days / 30;

  return [
    { name: "Web Development", revenue: Math.round(450000 * multiplier) },
    { name: "Data Science", revenue: Math.round(320000 * multiplier) },
    { name: "Mobile Development", revenue: Math.round(280000 * multiplier) },
    { name: "UI/UX Design", revenue: Math.round(150000 * multiplier) },
    { name: "DevOps", revenue: Math.round(50000 * multiplier) },
  ];
};
