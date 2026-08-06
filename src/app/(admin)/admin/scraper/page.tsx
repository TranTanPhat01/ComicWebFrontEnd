import type { Metadata } from "next";
import { AdminScraperScreen } from "@/features/admin-scraper/components/scraper-screen";

export const metadata: Metadata = {
  title: "Cào truyện tự động – Admin",
};

export default function AdminScraperPage() {
  return <AdminScraperScreen />;
}
