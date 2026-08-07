"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/providers/toast-provider";
import { ChangePasswordForm } from "@/features/authentication/components/change-password-form";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setUser(data.user);
          } else {
            router.push(ROUTES.login);
          }
        } else {
          router.push(ROUTES.login);
        }
      } catch (err) {
        toast("Lỗi kết nối hệ thống.", "error");
      } finally {
        setLoading(false);
      }
    }
    void fetchSession();
  }, [router, toast]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        toast("Đăng xuất thành công.", "success");
        router.push(ROUTES.home);
        setTimeout(() => {
          window.location.href = ROUTES.home;
        }, 200);
      } else {
        toast("Đăng xuất thất bại.", "error");
      }
    } catch (err) {
      toast("Lỗi kết nối.", "error");
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="admin-table__skeleton" style={{ width: "300px", height: "40px" }} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container" style={{ padding: "3rem 1rem", minHeight: "75vh", color: "#f8fafc" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        
        {/* Profile Card Header */}
        <div 
          style={{ 
            padding: "2.5rem", 
            backgroundColor: "rgba(30, 41, 59, 0.7)", 
            borderRadius: "var(--radius-lg)", 
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div 
              style={{ 
                width: "4.5rem", 
                height: "4.5rem", 
                borderRadius: "50%", 
                backgroundColor: "var(--color-primary, #f97316)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#ffffff"
              }}
            >
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: "bold", marginBottom: "0.25rem" }}>{user.username}</h2>
              <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>{user.email}</p>
              <span 
                style={{ 
                  display: "inline-block", 
                  marginTop: "0.5rem", 
                  padding: "0.2rem 0.75rem", 
                  backgroundColor: "rgba(249, 115, 22, 0.15)", 
                  color: "var(--color-primary, #f97316)", 
                  borderRadius: "9999px", 
                  fontSize: "0.8rem",
                  fontWeight: "600" 
                }}
              >
                {user.role === "Admin" ? "Quản trị viên" : "Độc giả"}
              </span>
            </div>
          </div>
          <div>
            <button 
              onClick={handleLogout} 
              disabled={loggingOut}
              className="btn btn--secondary" 
              style={{ 
                borderColor: "#ef4444", 
                color: "#ef4444", 
                padding: "0.6rem 1.5rem", 
                borderRadius: "9999px" 
              }}
            >
              {loggingOut ? "Đang đăng xuất..." : "Đăng xuất 🚪"}
            </button>
          </div>
        </div>

        {/* Change Password Panel */}
        <div 
          style={{ 
            padding: "2.5rem", 
            backgroundColor: "rgba(30, 41, 59, 0.7)", 
            borderRadius: "var(--radius-lg)", 
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
          }}
        >
          <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.75rem" }}>
            🔑 Đổi mật khẩu tài khoản
          </h3>
          
          <div style={{ maxWidth: "500px" }}>
            <ChangePasswordForm />
          </div>
        </div>

      </div>
    </div>
  );
}
