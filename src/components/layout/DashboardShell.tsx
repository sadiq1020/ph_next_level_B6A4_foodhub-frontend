"use client";

import { DashboardSidebar } from "./DashboardSidebar";

// This shell renders sidebar + page content side by side.
// It uses a fixed height trick to prevent the global footer from
// showing inside dashboard pages while keeping the global Navbar.
export function DashboardShell({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: string;
}) {
  return (
    // calc(100vh - navbar height). Navbar uses py-2 + inner content ≈ 60px
    <div
      className="flex"
      style={{ minHeight: "calc(100vh - 60px)" }}
    >
      <DashboardSidebar role={role} />
      <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
        {children}
      </main>
    </div>
  );
}