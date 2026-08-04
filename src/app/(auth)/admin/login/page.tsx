import type { Metadata } from "next";
import { AdminLoginScreen } from "@/features/authentication/components/admin-login-screen";

export const metadata: Metadata = {
  title: "Đăng nhập Admin",
  description: "Đăng nhập vào trang quản trị ComicWeb.",
};

/**
 * Admin login page.
 * Route: /admin/login
 */
export default function AdminLoginPage() {
  return <AdminLoginScreen />;
}
