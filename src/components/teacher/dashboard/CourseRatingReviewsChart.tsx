'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCourseRatingHistory, getCourseList, type CourseOption, type CourseRatingHistoryDataPoint } from '@/service/analytics.service';

type TimeRange = '7d' | '30d' | '90d';

export default function CourseRatingReviewsChart() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [data, setData] = useState<CourseRatingHistoryDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseList = await getCourseList();
        setCourses(courseList);
        if (courseList.length > 0) {
          setSelectedCourseId(courseList[0].id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setCourses([]);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch rating history when course or time range changes
  useEffect(() => {
    // Only fetch when selectedCourseId is set (not null and not empty)
    if (selectedCourseId === null || selectedCourseId === '') {
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getCourseRatingHistory({
          courseId: selectedCourseId,
          timeRange,
        });
        setData(response.chartData);
      } catch (error) {
        console.error('Failed to fetch rating history:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCourseId, timeRange]);

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">Course Ratings & Reviews</h2>
          <p className="text-sm text-muted-foreground mt-1">Track course quality and engagement</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedCourseId ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCourseId(value === '' ? null : value);
            }}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={courses.length === 0}
          >
            {courses.length === 0 ? (
              <option value="">No courses available</option>
            ) : (
              courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))
            )}
          </select>
          <div className="flex gap-2">
            {[
              { label: '7 days', value: '7d' as TimeRange },
              { label: '30 days', value: '30d' as TimeRange },
              { label: '3 months', value: '90d' as TimeRange },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  timeRange === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="flex items-center justify-center h-[350px] text-muted-foreground">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">No courses available</p>
            <p className="text-sm">Create your first course to see rating analytics</p>
          </div>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-[350px]">
          <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-[350px] text-muted-foreground">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">No rating data available</p>
            <p className="text-sm">This course has no reviews in the selected time range</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="var(--muted-foreground)"
              style={{ fontSize: '12px' }}
              domain={[0, 5]}
              label={{ value: 'Rating (0-5)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--muted-foreground)"
              style={{ fontSize: '12px' }}
              label={{ value: 'Reviews', angle: 90, position: 'insideRight' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--popover-foreground)',
              }}
              formatter={(value: any, name: string) => {
                if (name === 'rating') return [value, 'Rating'];
                if (name === 'reviews') return [value, 'Reviews'];
                return [value, name];
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="rating"
              stroke="var(--star)"
              strokeWidth={3}
              dot={{ fill: 'var(--star)', r: 4 }}
              activeDot={{ r: 6 }}
              name="Rating"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="reviews"
              stroke="var(--orange)"
              strokeWidth={3}
              dot={{ fill: 'var(--orange)', r: 4 }}
              activeDot={{ r: 6 }}
              name="Reviews"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
