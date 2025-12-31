"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  getUserGrowthData,
  TimePeriod,
  CustomDateRange,
} from "@/lib/admin-dashboard-mock-data";

interface DashboardUserGrowthChartProps {
  timePeriod: TimePeriod;
  customDateRange?: CustomDateRange;
}

export default function DashboardUserGrowthChart({
  timePeriod,
  customDateRange,
}: DashboardUserGrowthChartProps) {
  const data = getUserGrowthData(timePeriod, customDateRange);

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground">User Growth</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Track student and teacher growth over time
        </p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--green)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            stroke="var(--muted-foreground)"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            style={{ fontSize: "12px" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--popover-foreground)",
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="students"
            stroke="var(--green)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorStudents)"
            name="Students"
          />
          <Area
            type="monotone"
            dataKey="teachers"
            stroke="var(--chart-1)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorTeachers)"
            name="Teachers"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
