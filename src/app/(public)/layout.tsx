import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { DynamicScripts } from "@/components/shared/dynamic-scripts";

/**
 * Public layout — wraps all public-facing routes.
 * Includes the site header, footer, and scroll-to-top button.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-layout">
      <DynamicScripts />
      <PublicHeader />
      <main className="public-layout__main">{children}</main>
      <PublicFooter />
      <ScrollToTop />
    </div>
  );
}
