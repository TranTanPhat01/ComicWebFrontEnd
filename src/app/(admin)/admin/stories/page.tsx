import type { Metadata } from "next";
import { AdminStoriesScreen } from "@/features/admin-stories/components/admin-stories-screen";

export const metadata: Metadata = {
  title: "Quản lý Truyện – Admin",
};

/**
 * Admin stories list page.
 * Route: /admin/stories
 */
export default function AdminStoriesPage() {
  return <AdminStoriesScreen />;
}
