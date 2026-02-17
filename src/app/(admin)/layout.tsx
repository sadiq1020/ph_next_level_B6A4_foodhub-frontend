export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Just pass through children
  // Navbar/Footer come from root layout
  return <>{children}</>;
}
