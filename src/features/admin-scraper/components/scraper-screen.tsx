"use client";

import { useEffect, useState, useRef } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { getScrapedMetadata, importScrapedChapter } from "../api/admin-scraper.api";
import { getAdminStoriesBrowser, createAdminStory } from "@/features/admin-stories/api/admin-stories-browser.api";
import type { AdminStoryListItemDto } from "@/features/admin-stories/types/admin-story.types";

// ── SVG Icons (Phosphor-style, consistent 2px visual weight) ─────────────────
function IconPlay() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27Z" />
    </svg>
  );
}

function IconStop() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Z" />
    </svg>
  );
}

function IconSpinner() {
  return (
    <svg viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth={24} aria-hidden="true" className="scraper-spin" style={{ display: "block" }}>
      <circle cx="128" cy="128" r="104" strokeOpacity={0.2} />
      <path d="M128,24a104,104,0,0,1,104,104" strokeLinecap="round" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M137.54,186.36a8,8,0,0,1,0,11.31l-9.94,10A56,56,0,0,1,48.38,128.4L72.5,104.28A56,56,0,0,1,149.31,102a8,8,0,1,1-10.64,12,40,40,0,0,0-54.85,1.63L59.7,139.72a40,40,0,0,0,56.58,56.58l9.94-9.94A8,8,0,0,1,137.54,186.36Zm70.08-138a56.08,56.08,0,0,0-79.22,0l-9.94,9.95a8,8,0,0,0,11.32,11.31l9.94-9.94a40,40,0,0,1,56.58,56.58L172.18,140.4A40,40,0,0,1,117.33,142a8,8,0,0,0-10.64,12,56,56,0,0,0,76.81-2.26l24.12-24.12A56.08,56.08,0,0,0,207.62,48.38Z" />
    </svg>
  );
}

function IconCheckCircle() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
    </svg>
  );
}

function IconXCircle() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a16,16,0,1,1,16,16A16,16,0,0,1,112,84Z" />
    </svg>
  );
}

function IconDatabase() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface LogEntry {
  type: "info" | "success" | "error";
  message: string;
  timestamp: string;
}

// ── Main Component ────────────────────────────────────────────────────────────
export function AdminScraperScreen() {
  const [url, setUrl] = useState("");
  const [stories, setStories] = useState<AdminStoryListItemDto[]>([]);
  const [selectedStoryId, setSelectedStoryId] = useState<string>("new");
  const [loadingStories, setLoadingStories] = useState(true);

  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlingProgress, setCrawlingProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 });

  const shouldAbortRef = useRef(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal to bottom on new log entries
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Load existing stories
  useEffect(() => {
    async function loadStories() {
      try {
        const response = await getAdminStoriesBrowser({ page: 1, pageSize: 250 });
        if (response.success && response.data) {
          const raw = response.data as any;
          if (Array.isArray(raw.items)) setStories(raw.items);
          else if (Array.isArray(raw)) setStories(raw);
        }
      } catch (err) {
        console.error("Failed to load stories for scraper", err);
      } finally {
        setLoadingStories(false);
      }
    }
    void loadStories();
  }, []);

  const addLog = (type: "info" | "success" | "error", message: string) => {
    const time = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((prev) => [...prev, { type, message, timestamp: time }]);
  };

  const handleStop = () => {
    shouldAbortRef.current = true;
    addLog("error", "Nhận lệnh DỪNG. Sẽ kết thúc sau chương hiện tại...");
    setStatusMessage("Đang dừng...");
  };

  const handleStartCrawl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) { setError("Vui lòng nhập URL truyện nguồn."); return; }

    setIsCrawling(true);
    setCrawlingProgress(0);
    setError(null);
    setLogs([]);
    setStats({ total: 0, success: 0, failed: 0 });
    shouldAbortRef.current = false;

    addLog("info", `Bắt đầu cào: ${url}`);
    setStatusMessage("Đang lấy thông tin truyện và danh sách chương...");

    try {
      const metaResponse = await getScrapedMetadata({ url: url.trim() });
      if (!metaResponse.success) throw new Error(metaResponse.error?.message || "Không thể lấy thông tin truyện.");
      if (!metaResponse.data) throw new Error("Dữ liệu truyện trả về trống.");

      const meta = metaResponse.data;
      addLog("success", `Truyện: "${meta.title}" — Tác giả: ${meta.authorName}`);
      addLog("info", `Tổng cộng ${meta.chapters.length} chương cần nạp.`);
      setStats((s) => ({ ...s, total: meta.chapters.length }));

      let storyId: number;
      if (selectedStoryId === "new") {
        setStatusMessage("Đang tạo truyện mới...");
        addLog("info", "Đang tạo truyện mới trong hệ thống...");
        const createResponse = await createAdminStory({
          title: meta.title,
          slug: "",
          description: meta.description,
          coverImageUrl: meta.coverImageUrl,
          authorName: meta.authorName,
          genres: meta.genres,
        });
        if (!createResponse.success) throw new Error(createResponse.error?.message || "Lỗi khi tạo truyện mới.");
        if (!createResponse.data) throw new Error("Không nhận được phản hồi từ máy chủ.");
        storyId = createResponse.data.id;
        addLog("success", `Tạo truyện thành công! ID: ${storyId}`);
      } else {
        storyId = parseInt(selectedStoryId, 10);
        addLog("info", `Nạp vào truyện có sẵn — ID: ${storyId}`);
      }

      const total = meta.chapters.length;
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < total; i++) {
        if (shouldAbortRef.current) {
          addLog("error", `Đã dừng. Nạp thành công: ${successCount}/${total} chương.`);
          break;
        }
        const chapter = meta.chapters[i];
        setStatusMessage(`Đang nạp ${i + 1}/${total}: ${chapter.title}`);

        try {
          const importResponse = await importScrapedChapter(storyId, {
            url: chapter.url,
            chapterNumber: chapter.chapterNumber,
            title: chapter.title,
          });
          if (importResponse.success) {
            successCount++;
            addLog("success", `[${i + 1}/${total}] ${chapter.title}`);
          } else {
            failCount++;
            addLog("error", `[${i + 1}/${total}] Lỗi: ${importResponse.error?.message || "Không rõ"} — ${chapter.title}`);
          }
        } catch (chapterErr: any) {
          failCount++;
          addLog("error", `[${i + 1}/${total}] Lỗi hệ thống: ${chapterErr.message} — ${chapter.title}`);
        }

        setCrawlingProgress(Math.round(((i + 1) / total) * 100));
        setStats({ total, success: successCount, failed: failCount });
      }

      setStatusMessage("Hoàn thành quá trình import.");
      addLog("success", `Kết thúc. Thành công: ${successCount} | Thất bại: ${failCount} | Tổng: ${total}`);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi không xác định.");
      addLog("error", `Lỗi nghiêm trọng: ${err.message || err}`);
      setStatusMessage("Quá trình crawl bị gián đoạn.");
    } finally {
      setIsCrawling(false);
    }
  };

  const isIdle = !isCrawling && crawlingProgress === 0 && logs.length === 0;
  const isDone = !isCrawling && crawlingProgress > 0;
  const isExistingMode = selectedStoryId !== "new";

  return (
    <div className="admin-scraper">
      <PageHeader
        title="Cào Truyện Tự Động"
        description="Nhập URL trang truyện nguồn. Hệ thống tự động cào metadata và toàn bộ nội dung chương vào database."
      />

      <div className="admin-scraper__grid">

        {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <div className="admin-scraper__left">

          {/* Config Panel */}
          <div className="scraper-panel">
            <div className="scraper-panel__header">
              <div className="scraper-panel__header-icon">
                <IconLink />
              </div>
              <div>
                <div className="scraper-panel__title">Nguồn Truyện</div>
                <div className="scraper-panel__subtitle">nguontruyen.com &amp; truyenfull.*</div>
              </div>
            </div>

            <div className="scraper-panel__body">
              <form onSubmit={handleStartCrawl} className="scraper-form">

                {/* URL Input */}
                <div className="scraper-field">
                  <label htmlFor="scraper-url" className="scraper-field__label">
                    URL Trang Truyện
                  </label>
                  <div className="scraper-field__input-wrap">
                    <span className="scraper-field__icon"><IconLink /></span>
                    <input
                      id="scraper-url"
                      type="url"
                      className="scraper-field__input"
                      placeholder="https://nguontruyen.com/truyen/..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={isCrawling}
                      required
                      aria-label="URL trang truyện nguồn"
                    />
                  </div>
                </div>

                {/* Target Selector */}
                <div className="scraper-field">
                  <label className="scraper-field__label">Nhập vào</label>

                  {loadingStories ? (
                    <div className="scraper-loading">
                      <span style={{ width: 16, height: 16, display: "inline-flex" }}><IconSpinner /></span>
                      <span>Đang tải danh sách truyện...</span>
                    </div>
                  ) : (
                    <div className="scraper-target-list">
                      {/* Option A: New story */}
                      <label
                        className={`scraper-target-card${selectedStoryId === "new" ? " scraper-target-card--active" : ""}`}
                        onClick={() => !isCrawling && setSelectedStoryId("new")}
                      >
                        <input type="radio" className="scraper-target-card__radio" name="target" value="new" readOnly checked={selectedStoryId === "new"} />
                        <div className="scraper-target-card__icon">
                          <IconPlus />
                        </div>
                        <div>
                          <div className="scraper-target-card__title">Tạo truyện mới</div>
                          <div className="scraper-target-card__desc">Tự động lấy tên, tác giả, ảnh bìa, thể loại</div>
                        </div>
                      </label>

                      {/* Option B: Existing story */}
                      {stories.length > 0 && (
                        <div className={`scraper-target-select-wrap${isExistingMode ? " scraper-target-select-wrap--active" : ""}`}>
                          <div
                            className="scraper-target-select-wrap__header"
                            onClick={() => !isCrawling && setSelectedStoryId(String(stories[0]?.id ?? "new"))}
                          >
                            <span style={{ width: 14, height: 14, display: "inline-flex" }}><IconDatabase /></span>
                            Nạp tiếp vào truyện cũ
                          </div>
                          <select
                            className="scraper-target-select-wrap__select"
                            value={isExistingMode ? selectedStoryId : ""}
                            onChange={(e) => setSelectedStoryId(e.target.value)}
                            disabled={isCrawling || !isExistingMode}
                            aria-label="Chọn truyện để nạp"
                          >
                            {stories.map((story) => (
                              <option key={story.id} value={story.id}>
                                [{story.id}] {story.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="scraper-error">
                    <IconXCircle />
                    <span>{error}</span>
                  </div>
                )}

                {/* Action button */}
                {!isCrawling ? (
                  <button type="submit" className="scraper-btn scraper-btn--start" aria-label="Bắt đầu cào truyện">
                    <IconPlay />
                    Bắt đầu Crawl
                  </button>
                ) : (
                  <button type="button" onClick={handleStop} className="scraper-btn scraper-btn--stop" aria-label="Dừng cào truyện">
                    <IconStop />
                    Dừng Crawl
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Stats Row */}
          <div className="scraper-stats">
            <div className="scraper-stat-card">
              <div className="scraper-stat-card__label">Tổng chương</div>
              <div className="scraper-stat-card__value">{stats.total}</div>
            </div>
            <div className="scraper-stat-card">
              <div className="scraper-stat-card__label">Thành công</div>
              <div className="scraper-stat-card__value scraper-stat-card__value--success">{stats.success}</div>
            </div>
            <div className="scraper-stat-card">
              <div className="scraper-stat-card__label">Thất bại</div>
              <div className="scraper-stat-card__value scraper-stat-card__value--error">{stats.failed}</div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────────────────── */}
        <div className="admin-scraper__right">

          {/* Progress Card */}
          <div className="scraper-progress">
            <div className="scraper-progress__top">
              <span className="scraper-progress__label">Tiến Độ</span>
              <div style={{ display: "flex", alignItems: "center" }}>
                {isCrawling && (
                  <span className="scraper-progress__badge scraper-progress__badge--running">
                    <span style={{ width: 12, height: 12, display: "inline-flex" }}><IconSpinner /></span>
                    Đang chạy
                  </span>
                )}
                {isDone && (
                  <span className="scraper-progress__badge scraper-progress__badge--done">
                    <span style={{ width: 12, height: 12, display: "inline-flex" }}><IconCheckCircle /></span>
                    Hoàn thành
                  </span>
                )}
                <span className={`scraper-progress__pct${isCrawling ? " scraper-progress__pct--running" : isDone ? " scraper-progress__pct--done" : ""}`}>
                  {crawlingProgress}%
                </span>
              </div>
            </div>

            <div className="scraper-progress__track" role="progressbar" aria-valuenow={crawlingProgress} aria-valuemin={0} aria-valuemax={100}>
              <div
                className={`scraper-progress__fill${isDone && !isCrawling ? " scraper-progress__fill--done" : ""}`}
                style={{ width: `${crawlingProgress}%` }}
              />
            </div>

            <div className="scraper-progress__status">
              {statusMessage || (isIdle ? "Nhập URL và nhấn Bắt đầu Crawl để khởi chạy." : "Sẵn sàng.")}
            </div>
          </div>

          {/* Terminal Log */}
          <div className="scraper-terminal">
            <div className="scraper-terminal__bar">
              <div className="scraper-terminal__dots">
                <div className="scraper-terminal__dot scraper-terminal__dot--red" />
                <div className="scraper-terminal__dot scraper-terminal__dot--yellow" />
                <div className="scraper-terminal__dot scraper-terminal__dot--green" />
                <span className="scraper-terminal__title" style={{ marginLeft: 8 }}>nhật-ký.log</span>
              </div>
              <div className="scraper-terminal__meta">
                <span>{logs.length} dòng</span>
                {isCrawling && <span style={{ width: 12, height: 12, display: "inline-flex" }}><IconSpinner /></span>}
              </div>
            </div>

            <div className="scraper-terminal__body">
              {logs.length === 0 ? (
                <div className="scraper-terminal__empty">
                  <div>
                    <div className="scraper-terminal__empty-icon">
                      <span style={{ width: 20, height: 20, display: "inline-flex" }}><IconInfo /></span>
                    </div>
                    <div className="scraper-terminal__empty-text">
                      Nhật ký trống. Nhấn &ldquo;Bắt đầu Crawl&rdquo; để khởi chạy.
                    </div>
                  </div>
                </div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="log-line">
                    <span className="log-line__time">{log.timestamp}</span>
                    <LogBadge type={log.type} />
                    <span className={`log-line__text--${log.type === "success" ? "ok" : log.type === "error" ? "err" : "inf"}`}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-component: Log Badge ──────────────────────────────────────────────────
function LogBadge({ type }: { type: "info" | "success" | "error" }) {
  if (type === "success") return (
    <span className="log-line__badge log-line__badge--ok">
      <IconCheckCircle /> OK
    </span>
  );
  if (type === "error") return (
    <span className="log-line__badge log-line__badge--err">
      <IconXCircle /> ERR
    </span>
  );
  return (
    <span className="log-line__badge log-line__badge--inf">
      <IconInfo /> INF
    </span>
  );
}
