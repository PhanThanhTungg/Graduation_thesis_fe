import Dashboard from "@/components/admin/dashboard";
import { hasServerPermission } from "@/lib/server-permission";
import { AlertCircle } from "lucide-react";

export default async function DashboardPage() {
  const hasAccess = await hasServerPermission("dashboard", "view");

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold">Access Denied</h3>
          <p className="text-muted-foreground">
            You do not have permission to view this content.
          </p>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}
