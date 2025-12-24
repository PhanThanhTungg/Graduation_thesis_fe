"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ContributionLevel = 0 | 1 | 2 | 3 | 4;

interface DayData {
  date: Date;
  count: number;
  level: ContributionLevel;
}

function getContributionLevel(count: number): ContributionLevel {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

function generateFakeData(): DayData[] {
  const data: DayData[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const count = i >= 355 && i <= 361 ? Math.floor(Math.random() * 15) : 0;
    const level = getContributionLevel(count);

    data.push({ date, count, level });
  }

  return data;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getLevelColor(level: ContributionLevel): string {
  switch (level) {
    case 0:
      return "bg-muted";
    case 1:
      return "bg-green/20";
    case 2:
      return "bg-green/40";
    case 3:
      return "bg-green/60";
    case 4:
      return "bg-green";
    default:
      return "bg-muted";
  }
}

export function LearningCalendar() {
  const data = useMemo(() => generateFakeData(), []);

  const weeks: DayData[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  const monthLabels: string[] = [];
  const currentMonth = new Date(data[0].date).getMonth();
  let lastMonth = currentMonth;

  for (let i = 0; i < weeks.length; i++) {
    const weekStart = weeks[i][0]?.date;
    if (weekStart) {
      const month = weekStart.getMonth();
      if (month !== lastMonth) {
        monthLabels.push(
          weekStart.toLocaleDateString("en-US", { month: "short" }),
        );
        lastMonth = month;
      } else {
        monthLabels.push("");
      }
    }
  }

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Learning Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="flex gap-1">
              <div className="flex flex-col gap-1 mr-2">
                {dayLabels.map((day, idx) => (
                  <div
                    key={day}
                    className="text-xs text-muted-foreground h-3 flex items-center"
                    style={{ visibility: idx % 2 === 0 ? "visible" : "hidden" }}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="flex-1">
                <div className="flex gap-1 mb-1">
                  {monthLabels.map((month, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-muted-foreground"
                      style={{ width: "14px" }}
                    >
                      {month}
                    </div>
                  ))}
                </div>
                <div className="flex gap-1">
                  {weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-1">
                      {week.map((day, dayIdx) => (
                        <TooltipProvider key={`${weekIdx}-${dayIdx}`}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-ring transition-all ${getLevelColor(day.level)}`}
                                title={formatDate(day.date)}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-semibold">
                                {day.count} activities
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(day.date)}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-muted" />
                <div className="w-3 h-3 rounded-sm bg-green/20" />
                <div className="w-3 h-3 rounded-sm bg-green/40" />
                <div className="w-3 h-3 rounded-sm bg-green/60" />
                <div className="w-3 h-3 rounded-sm bg-green" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
