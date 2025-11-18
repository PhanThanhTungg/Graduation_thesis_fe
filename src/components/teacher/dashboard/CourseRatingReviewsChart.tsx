'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCourseRatingData, getCourseOptions } from '@/lib/teacher-dashboard-mock-data';

type TimeRange = 7 | 30 | 90;

export default function CourseRatingReviewsChart() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('1');
  const [timeRange, setTimeRange] = useState<TimeRange>(7);
  const courses = getCourseOptions();
  const data = getCourseRatingData(selectedCourseId, timeRange);
  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">Course Ratings & Reviews</h2>
          <p className="text-sm text-muted-foreground mt-1">Track course quality and engagement</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            {[
              { label: '7 days', value: 7 as TimeRange },
              { label: '30 days', value: 30 as TimeRange },
              { label: '3 months', value: 90 as TimeRange },
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
    </div>
  );
}
