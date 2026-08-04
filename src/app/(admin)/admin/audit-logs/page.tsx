import type { Metadata } from "next";
import { AuditLogsScreen } from "@/features/audit-logs/components/audit-logs-screen";

export const metadata: Metadata = {
  title: "Audit Logs – Admin",
};

/**
 * Admin audit logs page.
 * Route: /admin/audit-logs
 */
export default function AdminAuditLogsPage() {
  return <AuditLogsScreen />;
}
