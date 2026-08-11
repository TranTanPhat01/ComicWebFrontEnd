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
  
  // Tab quản lý cấu hình
  const [activeTab, setActiveTab] = useState<"ads" | "scripts">("ads");

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
        description="Quản lý link liên kết Shopee popup mở khóa, mã nhúng scripts marketing (Analytics, Pixel) và SEO custom."
      />

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "5rem" }}>
          <div className="admin-table__skeleton" style={{ width: "100%", height: "250px" }} />
        </div>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          {/* Navigation Tabs */}
          <div className="settings-tabs">
            <button
              type="button"
              className={`settings-tab-btn ${activeTab === "ads" ? "settings-tab-btn--active" : ""}`}
              onClick={() => setActiveTab("ads")}
            >
              🛒 Cấu hình Ads & Popup
            </button>
            <button
              type="button"
              className={`settings-tab-btn ${activeTab === "scripts" ? "settings-tab-btn--active" : ""}`}
              onClick={() => setActiveTab("scripts")}
            >
              🌐 Nhúng Scripts & SEO
            </button>
          </div>

          {error && <p className="admin-form__error" style={{ marginBottom: "1.5rem" }}>{error}</p>}
          {successMsg && (
            <p 
              className="admin-form__success" 
              style={{ 
                marginBottom: "1.5rem", 
                color: "#22c55e", 
                backgroundColor: "rgba(34, 197, 94, 0.1)", 
                padding: "1rem", 
                borderRadius: "var(--radius-lg)", 
                fontWeight: "bold" 
              }}
            >
              {successMsg}
            </p>
          )}

          <form className="settings-grid" onSubmit={handleSubmit}>
            {/* Left Column: Form Fields */}
            <div className="settings-card">
              {activeTab === "ads" ? (
                <div>
                  <h3 className="settings-card__title">🛒 Thiết lập Popup Shopee Mở Khóa</h3>
                  
                  <div className="settings-field-group">
                    <label className="settings-label">
                      <span className="settings-label__text">Link Shopee Mặc Định (Global Affiliate Link)</span>
                      <input
                        type="text"
                        className="settings-input"
                        value={globalAffiliateLink}
                        onChange={(e) => setGlobalAffiliateLink(e.target.value)}
                        placeholder="Ví dụ: https://s.shopee.vn/5VQs1u9Ziv"
                      />
                      <span className="settings-label__desc">
                        Link Shopee mặc định sẽ hiển thị làm popup mở khóa từ chương 2 của mọi truyện (áp dụng khi chương đó chưa cài link riêng).
                      </span>
                    </label>

                    <label className="settings-label" style={{ marginTop: "1rem" }}>
                      <span className="settings-label__text">Ảnh Sản Phẩm Mặc Định (Global Affiliate Image URL)</span>
                      <input
                        type="text"
                        className="settings-input"
                        value={globalAffiliateImage}
                        onChange={(e) => setGlobalAffiliateImage(e.target.value)}
                        placeholder="Ví dụ: https://pub-img.com/giay-an-top-gia.jpg"
                      />
                      <span className="settings-label__desc">
                        URL hình ảnh sản phẩm thực tế hiển thị ở trung tâm của popup (Có thể copy link ảnh từ trang sản phẩm Shopee).
                      </span>
                    </label>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="settings-card__title">🌐 Nhúng Mã Theo Dõi & SEO</h3>
                  
                  <div className="settings-field-group">
                    <label className="settings-label">
                      <span className="settings-label__text">Nhúng mã vào HEAD Script (Google Analytics, Facebook Pixel,...)</span>
                      <textarea
                        className="settings-textarea"
                        rows={5}
                        value={headScripts}
                        onChange={(e) => setHeadScripts(e.target.value)}
                        placeholder="<!-- Paste Google Analytics hoặc Facebook Pixel tracking code vào đây -->"
                      />
                      <span className="settings-label__desc">Mã này sẽ tự động được inject vào thẻ &lt;head&gt; ngoài trang public của website.</span>
                    </label>

                    <label className="settings-label" style={{ marginTop: "1rem" }}>
                      <span className="settings-label__text">Nhúng mã vào BODY Script (Ví dụ: Facebook Chat, Tawk.to,...)</span>
                      <textarea
                        className="settings-textarea"
                        rows={5}
                        value={bodyScripts}
                        onChange={(e) => setBodyScripts(e.target.value)}
                        placeholder="<!-- Paste chat widget script hoặc các body scripts khác vào đây -->"
                      />
                      <span className="settings-label__desc">Mã này sẽ tự động được inject vào phần cuối thẻ &lt;body&gt; ngoài trang public.</span>
                    </label>

                    <label className="settings-label" style={{ marginTop: "1rem" }}>
                      <span className="settings-label__text">Thẻ Meta HTML Tùy Chỉnh (Custom Meta Tags)</span>
                      <textarea
                        className="settings-textarea"
                        rows={4}
                        value={metaTags}
                        onChange={(e) => setMetaTags(e.target.value)}
                        placeholder='<meta name="google-site-verification" content="XYZ" />'
                      />
                      <span className="settings-label__desc">Dùng để xác thực quyền sở hữu website với Google Search Console, Bing Webmaster tools.</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div style={{ marginTop: "2rem", borderTop: "1px solid var(--color-border)", paddingTop: "1.5rem" }}>
                <button 
                  className="btn btn--primary" 
                  type="submit" 
                  disabled={saving}
                  style={{
                    padding: "0.85rem 2rem",
                    fontSize: "0.95rem",
                    fontWeight: "700",
                    background: "linear-gradient(135deg, var(--color-primary-light), #388f8b)",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(56, 143, 139, 0.3)",
                    cursor: "pointer"
                  }}
                >
                  {saving ? "Đang lưu cấu hình..." : "💾 Lưu cấu hình hệ thống"}
                </button>
              </div>
            </div>

            {/* Right Column: Live Popup Mockup Preview (Only visible in Ads tab) */}
            {activeTab === "ads" && (
              <div className="preview-sticky">
                <div className="preview-container">
                  <div className="preview-header">
                    👁️ TRỰC QUAN POPUP TRÊN TRANG ĐỌC
                  </div>
                  
                  <div className="preview-mockup-popup">
                    {/* Mock Close Button */}
                    <div style={{ alignSelf: "flex-end", cursor: "not-allowed", color: "#94a3b8", fontSize: "0.9rem", marginTop: "-0.5rem", marginBottom: "0.5rem" }}>
                      ✕
                    </div>

                    <h4 className="preview-mockup-title">
                      Mời bạn CLICK vào liên kết bên dưới và <span style={{ color: "#ef4444", fontWeight: "800" }}>Mở Ứng Dụng Shopee</span> để mở khóa toàn bộ chương truyện!
                    </h4>

                    <div className="preview-mockup-link">
                      👉 {globalAffiliateLink || "https://shopee.vn/..."}
                    </div>

                    {globalAffiliateImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={globalAffiliateImage} 
                        alt="Ảnh sản phẩm demo" 
                        className="preview-mockup-image"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="preview-mockup-image-placeholder">
                        🖼️ [ Chưa có ảnh sản phẩm ]
                      </div>
                    )}

                    <button type="button" className="preview-mockup-btn" disabled>
                      🛒 Mở Ứng Dụng Shopee & Mở Khóa
                    </button>

                    <p className="preview-mockup-note">
                      Lưu ý: Khi bấm mở khóa, toàn bộ chương của truyện sẽ được mở khóa đọc tự do trong 7 ngày. Rất mong Quý độc giả ủng hộ.
                    </p>

                    <div className="preview-mockup-footer">
                      Xó Truyện và đội ngũ Editor xin chân thành cảm ơn!
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
