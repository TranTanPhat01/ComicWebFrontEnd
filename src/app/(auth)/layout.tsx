/**
 * Auth layout — minimal, no header/footer.
 * Used for login and other auth pages.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-surface-2)",
      }}
    >
      {children}
    </div>
  );
}
