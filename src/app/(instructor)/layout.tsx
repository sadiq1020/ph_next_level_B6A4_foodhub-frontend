export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Just pass through children
  // Navbar/Footer come from root layout
  return <>{children}</>;
}
