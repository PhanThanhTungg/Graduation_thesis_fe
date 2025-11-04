import { List, Plus } from "lucide-react";
import Link from "next/link";
import { ListCategory } from "./listCategory";

export default function CategoryPage() {
  return (
     <>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Link href="/admin/category/create" className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
          <Plus className="w-4 h-4" />
          Add Category
        </Link>
      </div>
      <ListCategory />
    </>
  )
}