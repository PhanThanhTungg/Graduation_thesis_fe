"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  getCourseStatsData,
  TimePeriod,
  CustomDateRange,
} from "@/lib/admin-dashboard-mock-data";

interface DashboardCourseStatsChartProps {
  timePeriod: TimePeriod;
  customDateRange?: CustomDateRange;
}

export default function DashboardCourseStatsChart({
  timePeriod,
  customDateRange,
}: DashboardCourseStatsChartProps) {
  const data = getCourseStatsData(timePeriod, customDateRange);

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground">Course Statistics</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Published vs Unpublished courses over time
        </p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
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
          <Bar
            dataKey="published"
            fill="var(--green)"
            name="Published"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="unpublished"
            fill="var(--muted-foreground)"
            name="Unpublished"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
