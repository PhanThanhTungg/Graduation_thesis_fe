"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  getOrdersByStatus,
  TimePeriod,
  CustomDateRange,
} from "@/lib/admin-dashboard-mock-data";

const COLORS: Record<string, string> = {
  Success: "var(--green)",
  Processing: "var(--yellow)",
  Cancelled: "var(--destructive)",
};

interface DashboardOrdersStatusChartProps {
  timePeriod: TimePeriod;
  customDateRange?: CustomDateRange;
}

export default function DashboardOrdersStatusChart({
  timePeriod,
  customDateRange,
}: DashboardOrdersStatusChartProps) {
  const data = getOrdersByStatus(timePeriod, customDateRange);

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground">Orders by Status</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Distribution of order statuses
        </p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name] || "var(--muted-foreground)"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--popover-foreground)",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
