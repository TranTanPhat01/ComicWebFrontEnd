import { redirect } from "next/navigation";
import { getSession } from "./auth-session";
import { clearAuthCookies } from "./auth-cookies";
import type { AuthSession } from "@/features/authentication/types/auth.types";

/**
 * Server guard that requires the current user to be authenticated as an Admin.
 * 
 * - If not logged in: Redirects to /admin/login (with optional returnUrl).
 * - If mustChangePassword is true: Redirects to /admin/change-password.
 * - If role is not Admin: Redirects to /admin/login?error=Forbidden.
 * 
 * This must be called inside Server Components (like layouts or pages)
 * to perform server-side access control.
 */
export async function requireAdmin(returnUrl?: string): Promise<AuthSession> {
  const session = await getSession();

  if (!session) {
    try {
      await clearAuthCookies();
    } catch (e) {
      // Ignore cookie errors during SSR
    }
    const returnParam = returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : "";
    redirect(`/admin/login${returnParam}`);
  }

  if (session.mustChangePassword) {
    redirect("/admin/change-password");
  }

  if (session.user.role !== "Admin") {
    // Non-admin user cannot access admin area
    redirect("/admin/login?error=Forbidden");
  }

  return session;
}
