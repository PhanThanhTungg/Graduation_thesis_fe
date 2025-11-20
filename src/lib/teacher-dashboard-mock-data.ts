// Mock data generator for teacher dashboard

export interface SummaryData {
  totalRevenue: number;
  revenueIncrease: number;
  totalStudents: number;
  studentsIncrease: number;
  totalFees: number;
  feesIncrease: number;
  totalCourses: number;
  coursesIncrease: number;
}

// Format currency helper
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

export interface RevenueData {
  date: string;
  revenue: number;
  profit: number;
}

export interface TopCourse {
  id: string;
  name: string;
  revenue: number;
  rating: number;
  students: number;
}

export interface StudentsByCountry {
  country: string;
  count: number;
}

export interface CourseRatingData {
  date: string;
  rating: number;
  reviews: number;
}

export interface CourseOption {
  id: string;
  name: string;
}

// Generate summary data
export const getSummaryData = (): SummaryData => {
  return {
    totalRevenue: 125000,
    revenueIncrease: 15,
    totalStudents: 1250,
    studentsIncrease: 8,
    totalFees: 95000,
    feesIncrease: 12,
    totalCourses: 24,
    coursesIncrease: 2,
  };
};

// Generate revenue data for different periods
export const getRevenueData = (days: number): RevenueData[] => {
  const data: RevenueData[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic revenue with some variation
    const baseRevenue = 1000 + Math.random() * 500;
    const profitMargin = 0.6 + Math.random() * 0.2;
    
    data.push({
      date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      revenue: Math.round(baseRevenue),
      profit: Math.round(baseRevenue * profitMargin),
    });
  }
  
  return data;
};

// Generate top courses data
export const getTopCourses = (): TopCourse[] => {
  return [
    {
      id: '1',
      name: 'Advanced React & Next.js Development',
      revenue: 28500,
      rating: 4.8,
      students: 342,
    },
    {
      id: '2',
      name: 'Full Stack Web Development Bootcamp',
      revenue: 24200,
      rating: 4.7,
      students: 298,
    },
    {
      id: '3',
      name: 'Python for Data Science & Machine Learning',
      revenue: 21800,
      rating: 4.9,
      students: 265,
    },
    {
      id: '4',
      name: 'UI/UX Design Masterclass',
      revenue: 18900,
      rating: 4.6,
      students: 234,
    },
    {
      id: '5',
      name: 'Mobile App Development with Flutter',
      revenue: 16700,
      rating: 4.5,
      students: 198,
    },
  ];
};

// Generate students by country data
export const getStudentsByCountry = (): StudentsByCountry[] => {
  return [
    { country: 'Vietnam', count: 450 },
    { country: 'United States', count: 285 },
    { country: 'India', count: 220 },
    { country: 'United Kingdom', count: 165 },
    { country: 'Canada', count: 130 },
    { country: 'Australia', count: 98 },
    { country: 'Singapore', count: 82 },
    { country: 'Germany', count: 75 },
    { country: 'Japan', count: 68 },
    { country: 'South Korea', count: 52 },
  ];
};

// Generate course rating and review data
export const getCourseRatingData = (courseId: string, days: number): CourseRatingData[] => {
  const data: CourseRatingData[] = [];
  const today = new Date();
  
  // Base rating varies by course
  const baseRating = 4.2 + Math.random() * 0.7;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Rating tends to improve slightly over time with small variations
    const ratingVariation = (Math.random() - 0.5) * 0.3;
    const trendImprovement = ((days - i) / days) * 0.3;
    const rating = Math.min(5, Math.max(3, baseRating + trendImprovement + ratingVariation));
    
    // Reviews increase over time with some variation
    const baseReviews = 2 + Math.floor(Math.random() * 8);
    
    data.push({
      date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      rating: Math.round(rating * 10) / 10,
      reviews: baseReviews,
    });
  }
  
  return data;
};

// Get available courses for dropdown
export const getCourseOptions = (): CourseOption[] => {
  return [
    { id: '1', name: 'Advanced React & Next.js Development' },
    { id: '2', name: 'Full Stack Web Development Bootcamp' },
    { id: '3', name: 'Python for Data Science & Machine Learning' },
    { id: '4', name: 'UI/UX Design Masterclass' },
    { id: '5', name: 'Mobile App Development with Flutter' },
    { id: '6', name: 'Node.js Backend Development' },
    { id: '7', name: 'DevOps & Cloud Computing' },
    { id: '8', name: 'Cybersecurity Fundamentals' },
  ];
};
