import type { Metadata } from "next";
import { AdminDashboardScreen } from "@/features/admin-stories/components/admin-dashboard-screen";

export const metadata: Metadata = {
  title: "Dashboard – Admin",
};

/**
 * Admin dashboard page.
 * Route: /admin
 */
export default function AdminDashboardPage() {
  return <AdminDashboardScreen />;
}
