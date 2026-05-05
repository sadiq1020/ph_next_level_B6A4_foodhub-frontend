"use client";

import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardShell({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: string;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar role={role} />
      <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
        {children}
      </main>
    </div>
  );
}