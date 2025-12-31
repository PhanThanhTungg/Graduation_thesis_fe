import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  ShoppingCart,
  DollarSign,
  UserCheck,
} from "lucide-react";
import {
  getAdminSummaryData,
  TimePeriod,
  CustomDateRange,
} from "@/lib/admin-dashboard-mock-data";

interface SummaryCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

function SummaryCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
}: SummaryCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-foreground mb-2">{value}</h3>
          <div className="flex items-center gap-1.5">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
            <span
              className={`text-sm font-medium ${isPositive ? "text-green" : "text-destructive"}`}
            >
              {Math.abs(change)}%
            </span>
            <span className="text-sm text-muted-foreground">vs last month</span>
          </div>
        </div>
        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor:
              iconColor === "bg-green-foreground"
                ? "var(--green-foreground)"
                : iconColor === "bg-primary-foreground"
                  ? "var(--primary-foreground)"
                  : iconColor === "bg-chart-1"
                    ? "var(--chart-1)"
                    : iconColor === "bg-chart-2"
                      ? "var(--chart-2)"
                      : iconColor === "bg-chart-3"
                        ? "var(--chart-3)"
                        : iconColor === "bg-chart-4"
                          ? "var(--chart-4)"
                          : iconColor === "bg-chart-5"
                            ? "var(--chart-5)"
                            : iconColor === "bg-star"
                              ? "var(--star)"
                              : "var(--primary-foreground)",
          }}
        >
          <Icon className="w-6 h-6 text-foreground" />
        </div>
      </div>
    </div>
  );
}

interface DashboardSummaryCardsProps {
  timePeriod: TimePeriod;
  customDateRange?: CustomDateRange;
}

export default function DashboardSummaryCards({
  timePeriod,
  customDateRange,
}: DashboardSummaryCardsProps) {
  const data = getAdminSummaryData(timePeriod, customDateRange);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(data.totalRevenue),
      change: data.revenueChange,
      icon: DollarSign,
      iconColor: "bg-green-foreground",
    },
    {
      title: "Total Users",
      value: data.totalUsers.toLocaleString(),
      change: data.usersChange,
      icon: Users,
      iconColor: "bg-primary-foreground",
    },
    {
      title: "Total Students",
      value: data.totalStudents.toLocaleString(),
      change: data.studentsChange,
      icon: UserCheck,
      iconColor: "bg-chart-1",
    },
    {
      title: "Total Teachers",
      value: data.totalTeachers.toLocaleString(),
      change: data.teachersChange,
      icon: Users,
      iconColor: "bg-chart-2",
    },
    {
      title: "Total Courses",
      value: data.totalCourses.toLocaleString(),
      change: data.coursesChange,
      icon: BookOpen,
      iconColor: "bg-chart-3",
    },
    {
      title: "Total Orders",
      value: data.totalOrders.toLocaleString(),
      change: data.ordersChange,
      icon: ShoppingCart,
      iconColor: "bg-chart-4",
    },
    {
      title: "Platform Fees",
      value: formatCurrency(data.platformFees),
      change: data.feesChange,
      icon: DollarSign,
      iconColor: "bg-chart-5",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <SummaryCard key={index} {...card} />
      ))}
    </div>
  );
}
