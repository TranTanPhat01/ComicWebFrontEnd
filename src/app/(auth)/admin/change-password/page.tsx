import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/auth-session";
import { ChangePasswordScreen } from "@/features/authentication/components/change-password-screen";

export const metadata: Metadata = {
  title: "Đổi mật khẩu Admin - ComicWeb",
  description: "Cập nhật mật khẩu quản trị viên.",
};

/**
 * Route: /admin/change-password
 * Enforces authenticated session before displaying password form.
 */
export default async function AdminChangePasswordPage() {
  const session = await getSession();

  // Must be authenticated to change password
  if (!session) {
    redirect("/admin/login?returnUrl=%2Fadmin%2Fchange-password");
  }

  return <ChangePasswordScreen user={session.user} />;
}
