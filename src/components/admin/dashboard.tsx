"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import DashboardSummaryCards from "./dashboard-summary-cards";
import DashboardRevenueChart from "./dashboard-revenue-chart";
import DashboardUserGrowthChart from "./dashboard-user-growth-chart";
import DashboardCourseStatsChart from "./dashboard-course-stats-chart";
import DashboardOrdersStatusChart from "./dashboard-orders-status-chart";
import DashboardRevenueCategoryChart from "./dashboard-revenue-category-chart";
import DashboardTopLists from "./dashboard-top-lists";
import type { DateRange } from "react-day-picker";

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

export default function Dashboard() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("30d");
  const [customDateRange, setCustomDateRange] = useState<CustomDateRange>({
    from: undefined,
    to: undefined,
  });
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);

  const handleTimePeriodChange = (value: string) => {
    if (value === "custom") {
      setIsCustomDateOpen(true);
      setTimePeriod("custom");
    } else {
      setTimePeriod(value as TimePeriod);
      setCustomDateRange({ from: undefined, to: undefined });
    }
  };

  const handleCustomDateSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setCustomDateRange({ from: range.from, to: range.to });
      setIsCustomDateOpen(false);
    } else if (range?.from) {
      setCustomDateRange({ from: range.from, to: undefined });
    }
  };

  const customDateDisplay =
    customDateRange.from && customDateRange.to
      ? `${format(customDateRange.from, "MMM dd, yyyy")} - ${format(customDateRange.to, "MMM dd, yyyy")}`
      : customDateRange.from
        ? `${format(customDateRange.from, "MMM dd, yyyy")} - ...`
        : "Select date range";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your platform performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="365d">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="custom">Custom date</SelectItem>
            </SelectContent>
          </Select>
          {timePeriod === "custom" && (
            <Popover open={isCustomDateOpen} onOpenChange={setIsCustomDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !customDateRange.from && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customDateDisplay}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={customDateRange.from}
                  selected={{
                    from: customDateRange.from,
                    to: customDateRange.to,
                  }}
                  onSelect={handleCustomDateSelect}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      <DashboardSummaryCards
        timePeriod={timePeriod}
        customDateRange={customDateRange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardRevenueChart
          timePeriod={timePeriod}
          customDateRange={customDateRange}
        />
        <DashboardUserGrowthChart
          timePeriod={timePeriod}
          customDateRange={customDateRange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCourseStatsChart
          timePeriod={timePeriod}
          customDateRange={customDateRange}
        />
        <DashboardOrdersStatusChart
          timePeriod={timePeriod}
          customDateRange={customDateRange}
        />
      </div>

      <DashboardRevenueCategoryChart
        timePeriod={timePeriod}
        customDateRange={customDateRange}
      />

      <DashboardTopLists
        timePeriod={timePeriod}
        customDateRange={customDateRange}
      />
    </div>
  );
}
