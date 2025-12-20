"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "all",
    label: "All friends",
    href: "/messenger/friends/all",
  },
  {
    id: "requests",
    label: "Friend requests",
    href: "/messenger/friends/requests",
  },
  {
    id: "sent",
    label: "Sent requests",
    href: "/messenger/friends/sent",
  },
  {
    id: "blocked",
    label: "Blocked",
    href: "/messenger/friends/blocked",
  },
];

export default function FriendsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-border">
        <div className="flex gap-1 px-6">
          {tabs.map((tab) => {
            return (
              <TabLink key={tab.id} href={tab.href}>
                {tab.label}
              </TabLink>
            );
          })}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function TabLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-3 font-medium text-sm transition-colors relative",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green" />
      )}
    </Link>
  );
}
