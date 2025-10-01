import Link from "next/link"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "../ui/navigation-menu"
import { ModeToggle } from "../theme/mode-toggle"
import Logo from "./logo"
import SearchPopover from "./search-popover"

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
  }
]

export default function ClientHeader() {
  return (
    <header>
      <section className="container-md flex items-center justify-between shadow-sm dark:border-b border-border">
        <Logo />

        <NavigationMenu viewport={false} className="hidden lg:block">
          <NavigationMenuList>
            {navItems.map(item => (
              item.href ? (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuLink asChild
                    className={`${navigationMenuTriggerStyle()} p-4 text-base hover:text-green`}
                  >
                    <Link href={item.href}>
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuTrigger className="p-4 text-base hover:text-green">{item.label}</NavigationMenuTrigger>
                  <NavigationMenuContent className="flex flex-col gap-1">
                    {item.children?.map(child => (
                      <Link href={child.href} key={child.label}
                        className="px-2 py-1 text-base font-medium hover:text-green"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <SearchPopover />
        </div>

        <div className="fixed top-0 right-0">
          <ModeToggle />
        </div>
      </section>
    </header>
  )
}