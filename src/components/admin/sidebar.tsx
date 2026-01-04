"use client";

import {
  BarChart2,
  Receipt,
  Building2,
  CreditCard,
  Folder,
  Wallet,
  Users2,
  Shield,
  MessagesSquare,
  Video,
  Settings,
  HelpCircle,
  Menu,
  Home,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
  onClick?: () => void;
}

interface NavSection {
  title: string;
  items: Array<{
    href: string;
    icon: LucideIcon;
    label: string;
  }>;
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
      { href: "/admin/course", icon: BarChart2, label: "Courses" },
      { href: "/admin/category", icon: Building2, label: "Category" },
    ],
  },
  {
    title: "Finance",
    items: [
      { href: "/admin/transactions", icon: Wallet, label: "Transactions" },
      { href: "/admin/payments", icon: CreditCard, label: "Payments" },
    ],
  },
  {
    title: "Team",
    items: [
      { href: "/admin/user", icon: Users2, label: "Users" },
      { href: "/admin/permissions", icon: Shield, label: "Permissions" },
      { href: "/admin/admins", icon: Users2, label: "Admins" },
    ],
  },
];

const FOOTER_ITEMS = [
  { href: "/admin/settings", icon: Settings, label: "Settings" },
  { href: "#", icon: HelpCircle, label: "Help" },
];

function NavItem({ href, icon: Icon, children, onClick }: NavItemProps) {
  const pathname = usePathname();
  const isActive = href !== "#" && pathname.includes(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
        isActive
          ? "text-green bg-green-foreground font-medium"
          : "text-muted-foreground hover:text-primary hover:bg-primary-foreground",
      )}
    >
      <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
      {children}
    </Link>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
      {children}
    </div>
  );
}

function Logo() {
  return (
    <Link
      href="/admin/dashboard"
      className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-[#1F1F23]"
    >
      <div className="flex items-center gap-3">
        <Image
          src="/favicon.ico"
          alt="Aikabis"
          width={32}
          height={32}
          className="flex-shrink-0"
        />
        <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white">
          Aikabis
        </span>
      </div>
    </Link>
  );
}

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = () => setIsMobileMenuOpen(false);

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-1 p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>

      <nav
        className={cn(
          "fixed inset-y-0 left-0 z-1 w-64 bg-white dark:bg-[#0F0F12] transform transition-transform duration-200 ease-in-out",
          "lg:translate-x-0 lg:fixed lg:w-64 border-r border-gray-200 dark:border-[#1F1F23]",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-full flex flex-col">
          <Logo />

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              {NAV_SECTIONS.map((section) => (
                <div key={section.title}>
                  <SectionTitle>{section.title}</SectionTitle>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <NavItem
                        key={item.label}
                        href={item.href}
                        icon={item.icon}
                        onClick={handleNavigation}
                      >
                        {item.label}
                      </NavItem>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
            <div className="space-y-1">
              {FOOTER_ITEMS.map((item) => (
                <NavItem
                  key={item.label}
                  href={item.href}
                  icon={item.icon}
                  onClick={handleNavigation}
                >
                  {item.label}
                </NavItem>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
