"use client";

import { Menu, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { authClient, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import logo from "../../../public/images/logo.png";
import { ModeToggle } from "./ModeToggle";

const navLinks = [
  { title: "Explore Courses", url: "/courses"     },
  { title: "Instructors",     url: "/instructors"  },
  { title: "About",           url: "/about"        },
  { title: "Contact",         url: "/contact"      },
];

const Navbar = ({ className }: { className?: string }) => {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { items, setUserId, clearCart } = useCart();

  const user = session?.user;
  const role = (user as { role?: string })?.role ?? "";

  useEffect(() => {
    if (!isPending) {
      setUserId(user?.id ?? null);
    }
  }, [user?.id, isPending, setUserId]);

  const cartItemsCount =
    role === "CUSTOMER"
      ? items.reduce((total, item) => total + item.quantity, 0)
      : 0;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleLogout = async () => {
    clearCart();
    setUserId(null);
    await authClient.signOut();
    router.push("/login");
  };

  const renderDropdownItems = () => {
    if (role === "ADMIN") {
      return (
        <>
          <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/dashboard">Admin Panel</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-500">
            Logout
          </DropdownMenuItem>
        </>
      );
    }

    if (role === "INSTRUCTOR") {
      return (
        <>
          <DropdownMenuItem asChild>
            <Link href="/instructor/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/instructor/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-500">
            Logout
          </DropdownMenuItem>
        </>
      );
    }

    return (
      <>
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders">My Orders</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500">
          Logout
        </DropdownMenuItem>
      </>
    );
  };

  const renderAuthSection = () => {
    if (isPending) {
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      );
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {getInitials(user.name || "U")}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            {renderDropdownItems()}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <>
        <Button asChild variant="outline" size="sm">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/register">Sign up</Link>
        </Button>
      </>
    );
  };

  return (
    // ── py-2 on section only — removed duplicate py-4 on inner div ──
    <section className={cn("py-2 sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border", className)}>
      <div className="container mx-auto px-4">

        {/* Desktop */}
        <nav className="hidden items-center justify-between lg:flex h-14">
          {/* Left: Logo + Nav links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image src={logo} alt="KitchenClass" width={36} height={36} className="h-9 w-9" />
              <span className="text-xl font-bold">
                <span className="text-orange-500">Kitchen</span>Class
              </span>
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                {navLinks.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink
                      asChild
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
                    >
                      <Link href={item.url}>{item.title}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right: Cart + Mode + Auth */}
          <div className="flex items-center gap-2">
            {role === "CUSTOMER" && (
              <Button asChild variant="outline" size="icon" className="relative">
                <Link href="/cart">
                  <ShoppingCart className="w-4 h-4" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </Button>
            )}
            <ModeToggle />
            {renderAuthSection()}
          </div>
        </nav>

        {/* Mobile */}
        <div className="flex items-center justify-between lg:hidden h-12">
          <Link href="/" className="flex items-center gap-2">
            <Image src={logo} alt="KitchenClass" width={32} height={32} className="h-8 w-8" />
            <span className="text-lg font-bold">
              <span className="text-orange-500">Kitchen</span>Class
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {role === "CUSTOMER" && (
              <Button asChild variant="outline" size="icon" className="relative">
                <Link href="/cart">
                  <ShoppingCart className="w-4 h-4" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </Button>
            )}
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2">
                      <Image src={logo} alt="KitchenClass" width={24} height={24} className="h-7 w-7" />
                      <span className="text-lg font-semibold">
                        <span className="text-orange-500">Kitchen</span>Class
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6 p-4">
                  {/* Mobile Nav Links */}
                  <div className="flex flex-col gap-3">
                    {navLinks.map((item) => (
                      <Link
                        key={item.title}
                        href={item.url}
                        className="text-sm font-semibold hover:text-orange-500 transition-colors"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Auth */}
                  <div className="flex flex-col gap-3">
                    {isPending ? (
                      <Skeleton className="h-9 w-full" />
                    ) : user ? (
                      <>
                        <div className="flex items-center gap-2 border rounded-lg p-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {getInitials(user.name || "U")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{role}</p>
                          </div>
                        </div>

                        {role === "ADMIN" && (
                          <>
                            <Button asChild variant="outline"><Link href="/profile">Profile</Link></Button>
                            <Button asChild variant="outline"><Link href="/admin/dashboard">Admin Panel</Link></Button>
                          </>
                        )}
                        {role === "INSTRUCTOR" && (
                          <>
                            <Button asChild variant="outline"><Link href="/instructor/profile">Profile</Link></Button>
                            <Button asChild variant="outline"><Link href="/instructor/dashboard">Dashboard</Link></Button>
                          </>
                        )}
                        {role === "CUSTOMER" && (
                          <>
                            <Button asChild variant="outline"><Link href="/profile">Profile</Link></Button>
                            <Button asChild variant="outline"><Link href="/orders">My Orders</Link></Button>
                          </>
                        )}

                        <Button variant="destructive" onClick={handleLogout}>
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button asChild variant="outline"><Link href="/login">Login</Link></Button>
                        <Button asChild><Link href="/register">Sign up</Link></Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </div>
    </section>
  );
};

export { Navbar };
