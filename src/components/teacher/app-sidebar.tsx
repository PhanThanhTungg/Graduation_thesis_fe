"use client"

import * as React from "react"
import { IconChartBar, IconDashboard, IconFolder, IconHelp, IconListDetails, IconSearch, IconSettings, IconUsers, IconWallet } from "@tabler/icons-react"
import { NavMain } from "@/components/teacher/nav-main"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Link from "next/link"
import { ArrowLeftToLine } from "lucide-react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/teacher/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Courses",
      url: "/teacher/courses",
      icon: IconListDetails,
    },
    {
      title: "Lessons",
      url: "/teacher/lessons",
      icon: IconFolder,
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Students",
      url: "#",
      icon: IconUsers,
    },
    {
      title: "Finance",
      url: "#",
      icon: IconWallet
    }
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/" className="hover:underline">
                <ArrowLeftToLine className="size-5" />
                <span className="text-base font-semibold">Exit</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/teacher/settings">
                <IconSettings />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
