"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  getRevenueChartData,
  TimePeriod,
  CustomDateRange,
} from "@/lib/admin-dashboard-mock-data";

interface DashboardRevenueChartProps {
  timePeriod: TimePeriod;
  customDateRange?: CustomDateRange;
}

export default function DashboardRevenueChart({
  timePeriod,
  customDateRange,
}: DashboardRevenueChartProps) {
  const data = getRevenueChartData(timePeriod, customDateRange);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground">Revenue & Orders</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Track revenue and orders over time
        </p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart
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
            yAxisId="left"
            stroke="var(--muted-foreground)"
            style={{ fontSize: "12px" }}
            tickFormatter={formatCurrency}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
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
            formatter={(value: number, name: string) => {
              if (name === "revenue") {
                return [formatCurrency(value), "Revenue"];
              }
              return [value, "Orders"];
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke="var(--green)"
            strokeWidth={3}
            dot={{ fill: "var(--green)", r: 4 }}
            activeDot={{ r: 6 }}
            name="Revenue"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            stroke="var(--chart-1)"
            strokeWidth={3}
            dot={{ fill: "var(--chart-1)", r: 4 }}
            activeDot={{ r: 6 }}
            name="Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
