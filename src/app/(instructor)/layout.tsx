// export default function InstructorLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // Just pass through children
//   // Navbar/Footer come from root layout
//   return <>{children}</>;
// }

import { DashboardShell } from "@/components/layout/DashboardShell";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="INSTRUCTOR">{children}</DashboardShell>;
}