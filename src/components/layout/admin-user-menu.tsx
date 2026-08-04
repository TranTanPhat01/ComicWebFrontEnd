"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AuthUserDto } from "@/features/authentication/types/auth.types";

interface AdminUserMenuProps {
  user: AuthUserDto;
}

export function AdminUserMenu({ user }: AdminUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        // Full reload redirect to completely clear client cache/state
        window.location.href = "/admin/login";
      } else {
        setIsLoggingOut(false);
      }
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="admin-user-menu-wrapper" style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="admin-header__user-btn"
        style={{
          background: "none",
          border: "none",
          color: "var(--color-text-primary)",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem",
          borderRadius: "var(--radius-md)",
          transition: "background var(--transition-fast)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--color-surface-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "none";
        }}
      >
        <span className="admin-header__avatar" style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: "var(--color-primary)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.85rem"
        }}>
          {user.username.charAt(0).toUpperCase()}
        </span>
        <span>{user.username}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          style={{
            width: "16px",
            height: "16px",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform var(--transition-fast)"
          }}
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998,
            }}
          />
          <div
            className="admin-user-menu__dropdown"
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: "0.5rem",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-lg)",
              minWidth: "180px",
              padding: "0.5rem 0",
              zIndex: 999,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{
              padding: "0.5rem 1rem",
              borderBottom: "1px solid var(--color-border)",
              fontSize: "0.8rem",
              color: "var(--color-text-muted)"
            }}>
              Vai trò: <strong>{user.role}</strong>
            </div>

            <Link
              href="/admin/change-password"
              onClick={() => setIsOpen(false)}
              style={{
                padding: "0.75rem 1rem",
                color: "var(--color-text-primary)",
                textDecoration: "none",
                fontSize: "0.9rem",
                transition: "background var(--transition-fast)"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-surface-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
            >
              Đổi mật khẩu
            </Link>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              style={{
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "0.75rem 1rem",
                color: "var(--color-error, #ef4444)",
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "background var(--transition-fast)",
                borderTop: "1px solid var(--color-border)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-surface-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
            >
              {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
