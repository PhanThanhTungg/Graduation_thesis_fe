"use client";

import { useState } from "react";
import { MessageSquare, Users, MessageCircle, Menu } from "lucide-react";
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

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Messenger</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-1">
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
                  "w-full justify-start gap-3 h-12",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50",
                )}
              >
                <Link href={item.href}>
                  <Icon className="size-5" />
                  <span>{item.label}</span>
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

  return (
    <>
      <div className="hidden md:flex w-64 border-r border-border bg-background flex-col">
        <SidebarContent />
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
