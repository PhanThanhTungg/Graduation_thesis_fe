"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: "📊",
  },
  {
    name: "Courses",
    href: "/admin/course",
    icon: "📚",
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: "🗂️",
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: "👥",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-card h-screen fixed left-0 top-0 border-r">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Button
                  asChild
                  variant={pathname === item.href ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href={item.href}>
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}