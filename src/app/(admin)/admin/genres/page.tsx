import type { Metadata } from "next";
import { AdminGenresScreen } from "@/features/admin-genres/components/admin-genres-screen";

export const metadata: Metadata = {
  title: "Quản lý thể loại – Admin",
};

export default function AdminGenresPage() {
  return <AdminGenresScreen />;
}
