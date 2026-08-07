"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useToast } from "@/providers/toast-provider";
import {
  getAdminUsersBrowser,
  updateAdminUserStatusBrowser,
  updateAdminUserRoleBrowser,
  type UserDetailsDto
} from "@/features/admin-users/api/admin-users-browser.api";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserDetailsDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load session để biết user hiện tại (tránh tự edit chính mình)
  const [currentAdminId, setCurrentAdminId] = useState<number | null>(null);

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            setCurrentAdminId(data.user.id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    void loadSession();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const filterActive = isActive === "true" ? true : isActive === "false" ? false : undefined;
    const res = await getAdminUsersBrowser({
      page,
      pageSize: 15,
      search: search || undefined,
      role: role || undefined,
      isActive: filterActive
    });
 
    if (res.success) {
      // Vì backend trả về PagedApiEnvelope có cấu trúc envelope.data.items hoặc tương tự.
      // API Client getAdminUsersBrowser trả về PaginatedResponse<UserDetailsDto>
      const data = res.data as any;
      if (Array.isArray(data.items)) {
        setUsers(data.items);
      } else if (Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        setUsers([]);
      }
      
      // Map meta pagination
      const meta = data.meta || data;
      setTotalPages(meta.totalPages || 1);
      setTotalCount(meta.totalCount || 0);
    } else {
      toast(res.error.message || "Không thể tải danh sách người dùng.", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, role, isActive]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    void loadUsers();
  };

  const handleToggleStatus = async (user: UserDetailsDto) => {
    if (user.id === currentAdminId) {
      toast("Bạn không thể tự vô hiệu hoá tài khoản của chính mình!", "warning");
      return;
    }

    setUpdatingId(user.id);
    const nextStatus = !user.isActive;
    const res = await updateAdminUserStatusBrowser(user.id, nextStatus);
    
    if (res.success) {
      toast(`Đã ${nextStatus ? "kích hoạt" : "vô hiệu hoá"} tài khoản ${user.username}!`, "success");
      setUsers(users.map(u => u.id === user.id ? { ...u, isActive: nextStatus } : u));
    } else {
      toast(res.error?.message ?? "Thao tác thất bại.", "error");
    }
    setUpdatingId(null);
  };

  const handleToggleRole = async (user: UserDetailsDto) => {
    if (user.id === currentAdminId) {
      toast("Bạn không thể tự thay đổi quyền của chính mình!", "warning");
      return;
    }

    setUpdatingId(user.id);
    const nextRole = user.role === "Admin" ? "User" : "Admin";
    const res = await updateAdminUserRoleBrowser(user.id, nextRole);

    if (res.success) {
      toast(`Đã thay đổi quyền tài khoản ${user.username} thành ${nextRole}!`, "success");
      setUsers(users.map(u => u.id === user.id ? { ...u, role: nextRole } : u));
    } else {
      toast(res.error?.message ?? "Thao tác thất bại.", "error");
    }
    setUpdatingId(null);
  };

  return (
    <div className="admin-users-page">
      <PageHeader
        title="Quản lý thành viên"
        description={`Quản lý vai trò (Role), kích hoạt/khóa tài khoản độc giả và quản trị viên (${totalCount} thành viên).`}
      />

      {/* Toolbar filter */}
      <div className="admin-toolbar" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1.5rem" }}>
        <form onSubmit={handleSearchSubmit} className="admin-search-form" style={{ display: "flex", gap: "0.5rem", flex: "1 1 300px" }}>
          <input
            type="search"
            placeholder="Tìm theo username hoặc email..."
            className="input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn--primary">Tìm kiếm</button>
        </form>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <select className="input" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
            <option value="">— Mọi vai trò —</option>
            <option value="User">Độc giả</option>
            <option value="Admin">Quản trị viên</option>
          </select>

          <select className="input" value={isActive} onChange={(e) => { setIsActive(e.target.value); setPage(1); }}>
            <option value="">— Mọi trạng thái —</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Bị khóa</option>
          </select>
        </div>
      </div>

      {/* Users table */}
      {loading ? (
        <div className="admin-table__skeleton" style={{ height: "300px", marginTop: "1.5rem" }} />
      ) : users.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)", padding: "3rem 0", textAlign: "center" }}>Không tìm thấy thành viên nào phù hợp.</p>
      ) : (
        <div className="admin-table-wrapper" style={{ marginTop: "1.5rem" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-table__th">Tên thành viên</th>
                <th className="admin-table__th">Địa chỉ Email</th>
                <th className="admin-table__th admin-table__th--center">Vai trò</th>
                <th className="admin-table__th admin-table__th--center">Trạng thái</th>
                <th className="admin-table__th">Đăng nhập cuối</th>
                <th className="admin-table__th">Ngày đăng ký</th>
                <th className="admin-table__th admin-table__th--center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="admin-table__row">
                  <td className="admin-table__td" style={{ fontWeight: "600" }}>{user.username} {user.id === currentAdminId && "⭐ (Bạn)"}</td>
                  <td className="admin-table__td">{user.email}</td>
                  <td className="admin-table__td admin-table__td--center">
                    <span 
                      className="status-badge" 
                      style={{ 
                        backgroundColor: user.role === "Admin" ? "rgba(124, 58, 237, 0.15)" : "rgba(148, 163, 184, 0.15)",
                        color: user.role === "Admin" ? "#7c3aed" : "#94a3b8"
                      }}
                    >
                      {user.role === "Admin" ? "Quản trị viên" : "Độc giả"}
                    </span>
                  </td>
                  <td className="admin-table__td admin-table__td--center">
                    <span 
                      className={`status-badge status-badge--${user.isActive ? "published" : "hidden"}`}
                    >
                      {user.isActive ? "Hoạt động" : "Bị khóa"}
                    </span>
                  </td>
                  <td className="admin-table__td admin-table__td--muted">{formatDate(user.lastLoginAt)}</td>
                  <td className="admin-table__td admin-table__td--muted">{formatDate(user.createdAt)}</td>
                  <td className="admin-table__td admin-table__td--center">
                    <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user)}
                        disabled={updatingId === user.id || user.id === currentAdminId}
                        className={`btn ${user.isActive ? "btn--secondary" : "btn--primary"}`}
                        style={{ 
                          padding: "0.3rem 0.75rem", 
                          fontSize: "0.8rem",
                          borderColor: user.isActive ? "#ef4444" : "#22c55e",
                          color: user.isActive ? "#ef4444" : "#22c55e",
                          background: "none"
                        }}
                      >
                        {user.isActive ? "Khóa 🚫" : "Mở khóa 🔓"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleRole(user)}
                        disabled={updatingId === user.id || user.id === currentAdminId}
                        className="btn btn--secondary"
                        style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem" }}
                      >
                        {user.role === "Admin" ? "Hạ độc giả 👤" : "Lên Admin ⚡"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admin-pagination" style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="btn btn--secondary"
          >
            Trước
          </button>
          <span style={{ alignSelf: "center", fontSize: "0.9rem" }}>Trang {page} / {totalPages}</span>
          <button
            type="button"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="btn btn--secondary"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
