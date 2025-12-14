'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getStudentsByCountry, type StudentsByCountry } from '@/service/analytics.service';

const COLORS = [
  'var(--green)',
  'var(--chart-1)',
  'var(--orange)',
  'var(--violet)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--yellow)',
  'var(--peach)',
];

export default function StudentsByCountryChart() {
  const [data, setData] = useState<StudentsByCountry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getStudentsByCountry();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch students by country:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground">Students by Country</h2>
        <p className="text-sm text-muted-foreground mt-1">Geographic distribution of enrolled students</p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis 
            dataKey="country" 
            stroke="var(--muted-foreground)"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis 
            stroke="var(--muted-foreground)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--popover)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--popover-foreground)',
            }}
            cursor={{ fill: 'var(--accent)' }}
            formatter={(value: number) => [value, 'Students']}
          />
          <Bar 
            dataKey="count" 
            radius={[8, 8, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
        {data.slice(0, 5).map((item, index) => (
          <div key={item.country} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="text-sm">
              <div className="font-medium text-foreground">{item.country}</div>
              <div className="text-muted-foreground">{item.count} students</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
