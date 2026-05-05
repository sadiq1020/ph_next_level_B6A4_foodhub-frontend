"use client";

import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
    BookOpen,
    ChefHat,
    GraduationCap,
    LayoutDashboard,
    List,
    LogOut,
    Menu,
    Package,
    ShoppingBag,
    User,
    UserCog,
    Users,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard",    href: "/admin/dashboard",    icon: LayoutDashboard },
  { label: "Users",        href: "/admin/users",        icon: Users            },
  { label: "Instructors",  href: "/admin/instructors",  icon: GraduationCap    },
  { label: "Enrollments",  href: "/admin/orders",       icon: Package          },
  { label: "Categories",   href: "/admin/categories",   icon: List             },
];

const INSTRUCTOR_NAV: NavItem[] = [
  { label: "Dashboard",   href: "/instructor/dashboard", icon: LayoutDashboard },
  { label: "My Courses",  href: "/instructor/courses",   icon: BookOpen        },
  { label: "Enrollments", href: "/instructor/orders",    icon: ShoppingBag     },
  { label: "Profile",     href: "/instructor/profile",   icon: User            },
];

const CUSTOMER_NAV: NavItem[] = [
  { label: "My Enrollments", href: "/orders",   icon: ShoppingBag },
  { label: "Profile",        href: "/profile",  icon: User        },
];

function getNavItems(role?: string): NavItem[] {
  if (role === "ADMIN")      return ADMIN_NAV;
  if (role === "INSTRUCTOR") return INSTRUCTOR_NAV;
  return CUSTOMER_NAV;
}

function getRoleLabel(role?: string) {
  if (role === "ADMIN")      return { label: "Admin Panel",        icon: UserCog  };
  if (role === "INSTRUCTOR") return { label: "Instructor Studio",  icon: ChefHat  };
  return { label: "My Account", icon: User };
}

// ── Single nav item ───────────────────────────────────
function SidebarItem({
  item,
  collapsed,
  onClick,
}: {
  item: NavItem;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href ||
    (item.href !== "/admin/dashboard" &&
      item.href !== "/instructor/dashboard" &&
      pathname.startsWith(item.href));

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
        collapsed ? "justify-center" : "",
        isActive
          ? "bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400"
          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50",
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

// ── Sidebar ───────────────────────────────────────────
export function DashboardSidebar({ role }: { role?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const navItems = getNavItems(role);
  const { label: roleLabel, icon: RoleIcon } = getRoleLabel(role);

  const handleSignOut = async () => {
    const { authClient } = await import("@/lib/auth-client");
    await authClient.signOut();
    toast.success("Signed out");
    router.replace("/login");
  };

  const user = session?.user as { name?: string; email?: string } | undefined;

  // ── Shared sidebar content ────────────────────────
  const sidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full">
      {/* Role header */}
      <div
        className={cn(
          "flex items-center gap-3 px-3 py-4 border-b border-zinc-200 dark:border-zinc-800",
          collapsed && !isMobile ? "justify-center px-2" : "",
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center shrink-0">
          <RoleIcon className="w-4 h-4 text-orange-500" />
        </div>
        {(!collapsed || isMobile) && (
          <div className="min-w-0">
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 truncate">
              {roleLabel}
            </p>
            {user?.name && (
              <p className="text-xs text-zinc-400 truncate">{user.name}</p>
            )}
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            collapsed={collapsed && !isMobile}
            onClick={isMobile ? () => setMobileOpen(false) : undefined}
          />
        ))}
      </nav>

      {/* Sign out */}
      <div className="p-2 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={handleSignOut}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors",
            collapsed && !isMobile ? "justify-center" : "",
          )}
          title={collapsed && !isMobile ? "Sign Out" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {(!collapsed || isMobile) && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile toggle button ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-orange-500 text-white shadow-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-zinc-900 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                Menu
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>
            {sidebarContent(true)}
          </div>
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300",
          collapsed ? "w-16" : "w-56",
        )}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex items-center gap-2 px-3 py-3 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800 transition-colors",
            collapsed ? "justify-center" : "justify-end",
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="w-4 h-4" />
          {!collapsed && <span>Collapse</span>}
        </button>

        {sidebarContent(false)}
      </aside>
    </>
  );
}