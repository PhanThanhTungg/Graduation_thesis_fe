'use client';

import { Star } from 'lucide-react';
import { getTopCourses } from '@/lib/teacher-dashboard-mock-data';

export default function TopCoursesTable() {
  const courses = getTopCourses();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground">Top 5 Courses</h2>
        <p className="text-sm text-muted-foreground mt-1">Highest revenue generating courses</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Rank</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Course Name</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Revenue</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Rating</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Students</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr 
                key={course.id} 
                className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm"
                    style={{
                      backgroundColor: index === 0 
                        ? 'var(--yellow)' 
                        : index === 1 
                        ? 'var(--mint)' 
                        : index === 2 
                        ? 'var(--peach)' 
                        : 'var(--muted)',
                      color: index < 3 ? 'var(--foreground)' : 'var(--muted-foreground)',
                    }}
                  >
                    {index + 1}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium text-foreground max-w-xs">
                    {course.name}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="font-semibold text-green">
                    {formatCurrency(course.revenue)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-star text-star" />
                    <span className="font-medium text-foreground">{course.rating}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="font-medium text-foreground">
                    {course.students.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
