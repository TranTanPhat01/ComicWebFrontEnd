"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { getAdminSettingsBrowser, saveAdminSettingsBrowser } from "@/features/admin-settings/api/admin-settings-browser.api";
import type { SettingItemDto } from "@/features/public-chapters/api/public-chapters-browser.api";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // States cho các setting cụ thể
  const [headScripts, setHeadScripts] = useState("");
  const [bodyScripts, setBodyScripts] = useState("");
  const [metaTags, setMetaTags] = useState("");
  const [globalAffiliateLink, setGlobalAffiliateLink] = useState("");
  const [globalAffiliateImage, setGlobalAffiliateImage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      setError(null);
      const res = await getAdminSettingsBrowser();
      if (res.success) {
        const settingsData = res.data;
        const settingsArray = Array.isArray(settingsData)
          ? settingsData
          : (settingsData as any)?.data || [];
        setSettings(settingsArray);
        
        // Map các giá trị vào state tương ứng
        const headItem = settingsArray.find((x: any) => x.key === "GlobalHeadScripts");
        if (headItem) setHeadScripts(headItem.value);

        const bodyItem = settingsArray.find((x: any) => x.key === "GlobalBodyScripts");
        if (bodyItem) setBodyScripts(bodyItem.value);

        const metaItem = settingsArray.find((x: any) => x.key === "CustomMetaTags");
        if (metaItem) setMetaTags(metaItem.value);

        const affiliateItem = settingsArray.find((x: any) => x.key === "GlobalAffiliateLink");
        if (affiliateItem) setGlobalAffiliateLink(affiliateItem.value);

        const affiliateImageItem = settingsArray.find((x: any) => x.key === "GlobalAffiliateImage");
        if (affiliateImageItem) setGlobalAffiliateImage(affiliateImageItem.value);
      } else {
        setError(res.error.message || "Không thể tải cấu hình hệ thống.");
      }
      setLoading(false);
    }
    void loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    const payload: SettingItemDto[] = [
      { key: "GlobalHeadScripts", value: headScripts, description: "Mã script chèn vào thẻ HEAD (ví dụ: Google Analytics, Facebook Pixel)." },
      { key: "GlobalBodyScripts", value: bodyScripts, description: "Mã script chèn vào thẻ BODY (ví dụ: các chat widget, scripts theo dõi)." },
      { key: "CustomMetaTags", value: metaTags, description: "Các thẻ meta tuỳ chỉnh (ví dụ: xác thực webmaster tools, custom OpenGraph tags)." },
      { key: "GlobalAffiliateLink", value: globalAffiliateLink, description: "Link Shopee mặc định dùng để hiển thị popup mở khóa cho các chương truyện (áp dụng từ chương 2 trở đi)." },
      { key: "GlobalAffiliateImage", value: globalAffiliateImage, description: "Link ảnh sản phẩm Shopee mặc định dùng để hiển thị trên popup mở khóa." }
    ];

    const res = await saveAdminSettingsBrowser(payload);
    if (res.success) {
      setSuccessMsg("Cập nhật cấu hình hệ thống thành công!");
    } else {
      setError(res.error.message || "Không thể cập nhật cấu hình.");
    }
    setSaving(false);
  };

  return (
    <div className="admin-settings-page">
      <PageHeader
        title="Cấu hình hệ thống"
        description="Quản lý mã nhúng scripts marketing (Google Analytics, Facebook Pixel) và các thẻ HTML meta custom."
      />

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
          <div className="admin-table__skeleton" style={{ width: "100%", height: "200px" }} />
        </div>
      ) : (
        <div className="admin-form-container" style={{ maxWidth: "800px", marginTop: "2rem" }}>
          {error && <p className="admin-form__error" style={{ marginBottom: "1rem" }}>{error}</p>}
          {successMsg && (
            <p 
              className="admin-form__success" 
              style={{ 
                marginBottom: "1rem", 
                color: "#22c55e", 
                backgroundColor: "rgba(34, 197, 94, 0.1)", 
                padding: "0.8rem", 
                borderRadius: "var(--radius-md)", 
                fontWeight: "bold" 
              }}
            >
              {successMsg}
            </p>
          )}

          <form className="admin-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <label className="admin-form__field admin-form__field--full">
              <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>Chèn mã nhúng HEAD Script (Google Analytics, Facebook Pixel, Google Tag Manager)</span>
              <textarea
                className="input"
                rows={6}
                value={headScripts}
                onChange={(e) => setHeadScripts(e.target.value)}
                placeholder="<!-- Paste Google Analytics hoặc Facebook Pixel tracking code vào đây -->"
                style={{ fontFamily: "monospace", fontSize: "0.85rem" }}
              />
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Mã này sẽ tự động được inject vào thẻ &lt;head&gt; ngoài trang public của trang đọc truyện.</span>
            </label>

            <label className="admin-form__field admin-form__field--full">
              <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>Chèn mã nhúng BODY Script (Ví dụ: Facebook Chat Widget, Tawk.to, hoặc các analytics scripts chạy ở body)</span>
              <textarea
                className="input"
                rows={6}
                value={bodyScripts}
                onChange={(e) => setBodyScripts(e.target.value)}
                placeholder="<!-- Paste chat widget script hoặc các body scripts khác vào đây -->"
                style={{ fontFamily: "monospace", fontSize: "0.85rem" }}
              />
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Mã này sẽ tự động được inject vào phần thẻ &lt;body&gt; ngoài trang public.</span>
            </label>

            <label className="admin-form__field admin-form__field--full">
              <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>Thẻ Meta HTML Tùy Chỉnh (Custom Meta Tags)</span>
              <textarea
                className="input"
                rows={5}
                value={metaTags}
                onChange={(e) => setMetaTags(e.target.value)}
                placeholder='<meta name="google-site-verification" content="XYZ" />'
                style={{ fontFamily: "monospace", fontSize: "0.85rem" }}
              />
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Các thẻ meta tùy chỉnh dùng để xác thực quyền sở hữu website với Google Search Console, Bing Webmaster tools.</span>
            </label>

            <label className="admin-form__field admin-form__field--full">
              <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>Link Shopee Mặc Định (Global Affiliate Link)</span>
              <input
                type="text"
                className="input"
                value={globalAffiliateLink}
                onChange={(e) => setGlobalAffiliateLink(e.target.value)}
                placeholder="https://shopee.vn/..."
                style={{ fontSize: "0.9rem" }}
              />
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Link Shopee mặc định sẽ hiển thị làm popup mở khóa từ chương 2 của mọi truyện (nếu chương đó chưa có link riêng).</span>
            </label>

            <label className="admin-form__field admin-form__field--full">
              <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>Ảnh Sản Phẩm Mặc Định (Global Affiliate Image URL)</span>
              <input
                type="text"
                className="input"
                value={globalAffiliateImage}
                onChange={(e) => setGlobalAffiliateImage(e.target.value)}
                placeholder="https://..."
                style={{ fontSize: "0.9rem" }}
              />
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Đường dẫn (URL) ảnh sản phẩm Shopee sẽ được hiển thị ở phần trung tâm của popup mở khóa (Ví dụ: ảnh gói giấy ăn, ảnh cuốn truyện,...).</span>
            </label>

            <div className="admin-modal__actions" style={{ marginTop: "1.5rem", justifyContent: "flex-start" }}>
              <button className="btn btn--primary" type="submit" disabled={saving}>
                {saving ? "Đang lưu cấu hình..." : "Lưu cấu hình hệ thống"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
