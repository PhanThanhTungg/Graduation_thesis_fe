import {
  getRecentOrders,
  getRecentUsers,
  getRecentCourses,
} from "@/lib/admin-dashboard-mock-data";
import {
  ShoppingCart,
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function RecentOrders() {
  const orders = getRecentOrders();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green" />;
      case "processing":
        return <Clock className="w-4 h-4 text-yellow" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="w-5 h-5 text-foreground" />
        <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
      </div>
      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-start justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {order.courseTitle}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {order.studentName}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(order.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(order.amount)}
              </span>
              {getStatusIcon(order.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentUsersList() {
  const users = getRecentUsers();

  const getRoleBadge = (role: string) => {
    return (
      <span
        className="px-2 py-0.5 rounded text-xs font-medium text-primary-foreground"
        style={{
          backgroundColor:
            role === "teacher" ? "var(--chart-1)" : "var(--green-foreground)",
        }}
      >
        {role}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "var(--green)",
      inactive: "var(--yellow)",
      banned: "var(--destructive)",
    };
    return (
      <span
        className="px-2 py-0.5 rounded text-xs font-medium text-primary-foreground"
        style={{ backgroundColor: colors[status] || "var(--muted)" }}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-foreground" />
        <h2 className="text-lg font-bold text-foreground">Recent Users</h2>
      </div>
      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-start justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-foreground">
                  {user.name}
                </p>
                {getRoleBadge(user.role)}
                {getStatusBadge(user.status)}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentCoursesList() {
  const courses = getRecentCourses();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-foreground" />
        <h2 className="text-lg font-bold text-foreground">Recent Courses</h2>
      </div>
      <div className="space-y-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-start justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {course.title}
                </p>
                {course.isPublished ? (
                  <Eye className="w-4 h-4 text-green" />
                ) : (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {course.teacherName}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(course.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="ml-4">
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(course.price)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardRecentActivities() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <RecentOrders />
      <RecentUsersList />
      <RecentCoursesList />
    </div>
  );
}
