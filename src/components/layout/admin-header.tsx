"use client";

import { AdminUserMenu } from "./admin-user-menu";
import { useTheme } from "@/providers/theme-provider";
import type { AuthUserDto } from "@/features/authentication/types/auth.types";

interface AdminHeaderProps {
  user: AuthUserDto;
}

/**
 * Admin top header bar.
 * Client Component that renders the page actions, theme switcher, and the user menu.
 */
export function AdminHeader({ user }: AdminHeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="admin-header">
      <div className="admin-header__container">
        <div className="admin-header__breadcrumb" aria-label="Breadcrumb">
          {/* Breadcrumb will be populated by individual pages */}
        </div>

        <div className="admin-header__actions" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="admin-header__theme-btn"
            aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            title={isDark ? "Chế độ sáng" : "Chế độ tối"}
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <AdminUserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
