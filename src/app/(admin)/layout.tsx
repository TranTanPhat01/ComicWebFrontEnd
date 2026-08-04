import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminHeader } from "@/components/layout/admin-header";
import { requireAdmin } from "@/lib/auth/require-admin";

/**
 * Admin layout — sidebar + header + main content.
 * Route group: (admin)
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="admin-layout">
      <div className="admin-layout__sidebar">
        <AdminSidebar />
      </div>

      <div className="admin-layout__body">
        <div className="admin-layout__header">
          <AdminHeader user={session.user} />
        </div>
        <main className="admin-layout__main">{children}</main>
      </div>
    </div>
  );
}
