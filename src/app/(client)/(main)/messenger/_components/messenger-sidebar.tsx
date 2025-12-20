"use client";

import { useState } from "react";
import {
  MessageSquare,
  Users,
  MessageCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const menuItems = [
  {
    id: "chats",
    label: "Chats",
    icon: MessageSquare,
    href: "/messenger/chats",
  },
  {
    id: "conversations",
    label: "Conversations",
    icon: MessageCircle,
    href: "/messenger/conversations",
  },
  {
    id: "friends",
    label: "Friends",
    icon: Users,
    href: "/messenger/friends",
  },
];

function SidebarContent({
  isCollapsed,
  onItemClick,
}: {
  isCollapsed?: boolean;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "p-4 border-b border-border flex items-center justify-between",
          isCollapsed && "flex-col gap-2",
        )}
      >
        {!isCollapsed && <h2 className="text-lg font-semibold">Messenger</h2>}
        {isCollapsed && <h2 className="text-lg font-semibold">M</h2>}
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <nav
          className={cn(
            "space-y-1",
            isCollapsed && "flex flex-col items-center",
          )}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.id}
                variant="ghost"
                asChild
                onClick={onItemClick}
                className={cn(
                  "h-12",
                  isCollapsed
                    ? "w-12 justify-center px-0"
                    : "w-full justify-start gap-3",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50",
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Link href={item.href}>
                  <Icon className="size-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export function MessengerSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <div
        className={cn(
          "hidden md:flex border-r border-border bg-background flex-col transition-all duration-300 relative",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarContent isCollapsed={isCollapsed} />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute -right-3 top-4 z-10 size-6 rounded-full border border-border bg-background shadow-sm hover:bg-muted",
            "flex items-center justify-center",
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
          <span className="sr-only">
            {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          </span>
        </Button>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-24 left-4 z-50 bg-background border border-border shadow-sm"
          >
            <Menu className="size-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Messenger Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full bg-background">
            <SidebarContent onItemClick={() => setIsOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
