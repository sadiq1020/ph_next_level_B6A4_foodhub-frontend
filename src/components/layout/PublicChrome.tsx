"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { usePathname } from "next/navigation";

// Routes that start with these prefixes get NO navbar/footer
const DASHBOARD_PREFIXES = ["/admin", "/instructor", "/profile", "/orders"];

export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboard = DASHBOARD_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}