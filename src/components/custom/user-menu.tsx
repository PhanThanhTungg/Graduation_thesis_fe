"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAvatarFallback } from "@/lib/helpers";
import { UserType } from "@/schema/user.schema";
import { clientLogout } from "@/service/auth.service";
import { User, Heart, Bell, HelpCircle, LogOut, BookCheck } from "lucide-react";
import Link from "next/link";

interface UserMenuProps {
  user: UserType;
}

export default function UserMenu({ user }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage src={user.avatarUrl || ""} alt={user.fullName} />
          <AvatarFallback>{getAvatarFallback(user.fullName)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="size-10">
            <AvatarImage src={user.avatarUrl || ""} alt={user.fullName} />
            <AvatarFallback className="text-xs">
              {getAvatarFallback(user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.fullName}</p>
            <p className="text-xs text-muted-foreground leading-none truncate">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="mr-2" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/wishlist" className="cursor-pointer">
              <Heart className="mr-2" />
              <span>Wishlist</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/notifications" className="cursor-pointer">
              <Bell className="mr-2" />
              <span>Notifications</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/my-learning" className="cursor-pointer">
              <BookCheck className="mr-2" />
              <span>My learning</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/help-and-support" className="cursor-pointer">
              <HelpCircle className="mr-2" />
              <span>Help & Support</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={clientLogout}
            className="cursor-pointer"
          >
            <LogOut className="mr-2" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
