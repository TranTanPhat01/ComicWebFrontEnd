import { AdminUserMenu } from "./admin-user-menu";
import type { AuthUserDto } from "@/features/authentication/types/auth.types";

interface AdminHeaderProps {
  user: AuthUserDto;
}

/**
 * Admin top header bar.
 * Server Component that renders the page actions and the user menu.
 */
export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <div className="admin-header__container">
        <div className="admin-header__breadcrumb" aria-label="Breadcrumb">
          {/* Breadcrumb will be populated by individual pages */}
        </div>

        <div className="admin-header__actions">
          <AdminUserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
