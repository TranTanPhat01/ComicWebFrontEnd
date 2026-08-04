import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

/**
 * Public layout — wraps all public-facing routes.
 * Includes the site header and footer.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-layout">
      <PublicHeader />
      <main className="public-layout__main">{children}</main>
      <PublicFooter />
    </div>
  );
}
