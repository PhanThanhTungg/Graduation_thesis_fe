import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { ModeToggle } from "../theme/mode-toggle";
import Logo from "./logo";
import SearchPopover from "./search-popover";
import { getMyProfile } from "@/service/user.service";
import { Button } from "../ui/button";
import UserMenu from "./user-menu";
import { unstable_noStore } from "next/cache";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Courses",
    href: "/courses",
  },
  {
    label: "Pages",
    children: [
      {
        label: "About",
        href: "/about",
      },
      {
        label: "Contact",
        href: "/contact",
      },
      {
        label: "FAQs",
        href: "/faqs",
      },
    ],
  },
];

export default async function ClientHeader() {
  unstable_noStore();
  const myProfile = await getMyProfile();

  return (
    <header className="sticky top-0 left-0 right-0 bg-background z-10 container-md flex items-center justify-between shadow-sm dark:border-b border-border">
      <Logo />

      <NavigationMenu viewport={false} className="hidden lg:block">
        <NavigationMenuList>
          {navItems.map((item) =>
            item.href ? (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} p-4 text-base hover:text-green`}
                >
                  <Link href={item.href}>{item.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuTrigger className="p-4 text-base hover:text-green">
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="flex flex-col gap-1">
                  {item.children?.map((child) => (
                    <Link
                      href={child.href}
                      key={child.label}
                      className="px-2 py-1 text-base font-medium hover:text-green"
                    >
                      {child.label}
                    </Link>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
            ),
          )}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-4">
        <SearchPopover />
        {myProfile ? (
          <>
            {myProfile.role === "teacher" && (
              <Button variant={"link"} className="hover:text-green">
                <Link href="/teacher/dashboard">Teacher</Link>
              </Button>
            )}
            <UserMenu user={myProfile} />
          </>
        ) : (
          <Button className="bg-green" size={"lg"}>
            <Link href="/login">Login/Register</Link>
          </Button>
        )}
      </div>

      <div className="fixed top-0 right-0">
        <ModeToggle />
      </div>
    </header>
  );
}
