import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
