import { Plus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ListCategory } from "./listCategory";
import { hasServerPermission } from "@/lib/server-permission";

export default async function CategoryPage() {
  const hasAccess = await hasServerPermission("category", "view");
  const canCreate = await hasServerPermission("category", "create");

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

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">Categories</h1>
        {canCreate && (
          <Link
            href="/admin/category/create"
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </Link>
        )}
      </div>
      <ListCategory />
    </>
  );
}
