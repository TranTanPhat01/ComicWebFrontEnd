import Link from "next/link";
import type { Metadata } from "next";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "404 – Không tìm thấy trang",
};

/**
 * Global 404 page.
 */
export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "1rem",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "4rem", fontWeight: 700, opacity: 0.2 }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
        Không tìm thấy trang
      </h2>
      <p style={{ color: "var(--color-text-muted)" }}>
        Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <Link
        href={ROUTES.home}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1.5rem",
          background: "var(--color-primary)",
          color: "white",
          borderRadius: "0.5rem",
          fontWeight: 500,
        }}
      >
        Về trang chủ
      </Link>
    </div>
  );
}
