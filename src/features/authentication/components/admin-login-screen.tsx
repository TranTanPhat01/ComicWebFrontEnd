"use client";

import React from "react";
import { AdminLoginForm } from "./admin-login-form";

export function AdminLoginScreen() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "radial-gradient(circle at 10% 20%, var(--color-surface-2) 0%, var(--color-surface-1) 100%)",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          background: "rgba(30, 41, 59, 0.7)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "var(--radius-xl)",
          padding: "2.5rem 2rem",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Brand/Logo Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              margin: 0,
              background: "linear-gradient(to right, var(--color-primary), #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ComicWeb Admin
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-muted)",
              marginTop: "0.5rem",
            }}
          >
            Đăng nhập vào hệ thống quản trị
          </p>
        </div>

        {/* The interactive login form */}
        <AdminLoginForm />
      </div>
    </div>
  );
}
