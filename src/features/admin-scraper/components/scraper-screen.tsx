"use client";

import { useEffect, useState, useRef } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { getScrapedMetadata, importScrapedChapter } from "../api/admin-scraper.api";
import { getAdminStoriesBrowser, createAdminStory } from "@/features/admin-stories/api/admin-stories-browser.api";
import type { AdminStoryListItemDto } from "@/features/admin-stories/types/admin-story.types";

// ── Inline SVG Icons (Phosphor-style, 2px stroke, consistent sizing) ──────────
function IconPlay({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27Z" />
    </svg>
  );
}

function IconStop({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Z" />
    </svg>
  );
}

function IconSpinner({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth={24} aria-hidden="true" className="animate-spin">
      <circle cx="128" cy="128" r="104" strokeOpacity={0.2} />
      <path d="M128,24a104,104,0,0,1,104,104" strokeLinecap="round" />
    </svg>
  );
}

function IconLink({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M137.54,186.36a8,8,0,0,1,0,11.31l-9.94,10A56,56,0,0,1,48.38,128.4L72.5,104.28A56,56,0,0,1,149.31,102a8,8,0,1,1-10.64,12,40,40,0,0,0-54.85,1.63L59.7,139.72a40,40,0,0,0,56.58,56.58l9.94-9.94A8,8,0,0,1,137.54,186.36Zm70.08-138a56.08,56.08,0,0,0-79.22,0l-9.94,9.95a8,8,0,0,0,11.32,11.31l9.94-9.94a40,40,0,0,1,56.58,56.58L172.18,140.4A40,40,0,0,1,117.33,142a8,8,0,0,0-10.64,12,56,56,0,0,0,76.81-2.26l24.12-24.12A56.08,56.08,0,0,0,207.62,48.38Z" />
    </svg>
  );
}

function IconCheckCircle({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
    </svg>
  );
}

function IconXCircle({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
    </svg>
  );
}

function IconInfo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a16,16,0,1,1,16,16A16,16,0,0,1,112,84Z" />
    </svg>
  );
}

function IconDatabase({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z" />
    </svg>
  );
}

function IconPlus({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
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

// ── Component ─────────────────────────────────────────────────────────────────
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
    const time = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLogs((prev) => [...prev, { type, message, timestamp: time }]);
  };

  const handleStop = () => {
    shouldAbortRef.current = true;
    addLog("error", "⛔ Nhận lệnh DỪNG từ quản trị viên. Sẽ dừng sau chương hiện tại...");
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

    addLog("info", `🔍 Bắt đầu cào: ${url}`);
    setStatusMessage("Đang lấy thông tin truyện và danh sách chương...");

    try {
      const metaResponse = await getScrapedMetadata({ url: url.trim() });
      if (!metaResponse.success) throw new Error(metaResponse.error?.message || "Không thể lấy thông tin truyện.");
      if (!metaResponse.data) throw new Error("Dữ liệu truyện trả về trống.");

      const meta = metaResponse.data;
      addLog("success", `📚 Truyện: "${meta.title}" — Tác giả: ${meta.authorName}`);
      addLog("info", `📋 Tổng cộng ${meta.chapters.length} chương cần nạp.`);
      setStats(s => ({ ...s, total: meta.chapters.length }));

      let storyId: number;
      if (selectedStoryId === "new") {
        setStatusMessage("Đang tạo truyện mới...");
        addLog("info", "🆕 Đang tạo truyện mới trong hệ thống...");
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
        addLog("success", `✅ Tạo truyện thành công! ID: ${storyId}`);
      } else {
        storyId = parseInt(selectedStoryId, 10);
        addLog("info", `📌 Nạp vào truyện có sẵn — ID: ${storyId}`);
      }

      const total = meta.chapters.length;
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < total; i++) {
        if (shouldAbortRef.current) {
          addLog("error", `⛔ Đã dừng. Nạp thành công: ${successCount}/${total} chương.`);
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

      setStatusMessage("✅ Hoàn thành quá trình import.");
      addLog("success", `🎉 Kết thúc. Thành công: ${successCount} | Thất bại: ${failCount} | Tổng: ${total}`);

    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi không xác định.");
      addLog("error", `💥 Lỗi nghiêm trọng: ${err.message || err}`);
      setStatusMessage("Quá trình crawl bị gián đoạn.");
    } finally {
      setIsCrawling(false);
    }
  };

  const isIdle = !isCrawling && crawlingProgress === 0 && logs.length === 0;
  const isDone = !isCrawling && crawlingProgress > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cào Truyện Tự Động"
        description="Nhập URL trang truyện nguồn và hệ thống sẽ tự động phát hiện, cào và nhập toàn bộ nội dung vào database."
      />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">

        {/* ── LEFT: Config Panel ───────────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-4">

          {/* Source Config Card */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm shadow-xl overflow-hidden">
            {/* Card Header */}
            <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-white/[0.06]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/20">
                <IconLink size={18} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Nguồn Truyện</h2>
                <p className="text-xs text-gray-500">Hỗ trợ nguontruyen.com &amp; truyenfull.*</p>
              </div>
            </div>

            <form onSubmit={handleStartCrawl} className="p-6 space-y-5">
              {/* URL Input */}
              <div className="space-y-1.5">
                <label htmlFor="story-url" className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                  URL Trang Truyện
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-600">
                    <IconLink size={15} />
                  </div>
                  <input
                    id="story-url"
                    type="url"
                    className="w-full rounded-xl border border-white/[0.08] bg-black/30 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 disabled:opacity-50"
                    placeholder="https://nguontruyen.com/truyen/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isCrawling}
                    required
                    aria-label="URL trang truyện nguồn"
                  />
                </div>
              </div>

              {/* Story Target Selector */}
              <div className="space-y-1.5">
                <label htmlFor="story-target" className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Nhập Vào
                </label>

                {loadingStories ? (
                  <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-gray-500">
                    <IconSpinner size={14} />
                    <span>Đang tải danh sách truyện...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* New Story Option */}
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ${
                        selectedStoryId === "new"
                          ? "border-violet-500/50 bg-violet-500/10 ring-1 ring-violet-500/20"
                          : "border-white/[0.07] bg-black/20 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="storyTarget"
                        value="new"
                        checked={selectedStoryId === "new"}
                        onChange={() => setSelectedStoryId("new")}
                        disabled={isCrawling}
                        className="sr-only"
                      />
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${selectedStoryId === "new" ? "bg-violet-500/20 text-violet-400" : "bg-white/5 text-gray-500"}`}>
                        <IconPlus size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">Tạo truyện mới</p>
                        <p className="truncate text-xs text-gray-500">Tự động cào tên, tác giả, ảnh bìa và thể loại</p>
                      </div>
                    </label>

                    {/* Existing Story Select */}
                    {stories.length > 0 && (
                      <div className={`rounded-xl border transition-all duration-200 ${selectedStoryId !== "new" ? "border-violet-500/50 ring-1 ring-violet-500/20" : "border-white/[0.07]"}`}>
                        <label
                          className={`flex cursor-pointer items-center gap-3 rounded-t-xl border-b px-4 py-3 transition-colors ${
                            selectedStoryId !== "new" ? "border-violet-500/20 bg-violet-500/10" : "border-white/[0.06] bg-black/20 hover:bg-white/[0.03]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="storyTarget"
                            value="_existing"
                            checked={selectedStoryId !== "new"}
                            onChange={() => setSelectedStoryId(String(stories[0]?.id ?? "new"))}
                            disabled={isCrawling}
                            className="sr-only"
                          />
                          <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${selectedStoryId !== "new" ? "bg-violet-500/20 text-violet-400" : "bg-white/5 text-gray-500"}`}>
                            <IconDatabase size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">Nạp tiếp vào truyện cũ</p>
                            <p className="text-xs text-gray-500">Chọn truyện từ danh sách</p>
                          </div>
                        </label>
                        <select
                          id="story-target"
                          className="w-full rounded-b-xl bg-black/20 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50"
                          value={selectedStoryId === "new" ? "" : selectedStoryId}
                          onChange={(e) => setSelectedStoryId(e.target.value)}
                          disabled={isCrawling || selectedStoryId === "new"}
                          aria-label="Chọn truyện để nạp chương vào"
                        >
                          {stories.map((story) => (
                            <option key={story.id} value={story.id} className="bg-gray-900">
                              [{story.id}] {story.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Error Banner */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                  <IconXCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              {!isCrawling ? (
                <button
                  type="submit"
                  className="group relative w-full overflow-hidden rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-all duration-200 hover:bg-violet-500 hover:shadow-violet-800/40 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  aria-label="Bắt đầu quá trình cào truyện"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    <IconPlay size={15} />
                    Bắt đầu Crawl
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStop}
                  className="w-full rounded-xl border border-rose-500/40 bg-rose-500/15 px-4 py-3 text-sm font-semibold text-rose-300 transition-all duration-200 hover:bg-rose-500/25 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  aria-label="Dừng quá trình cào"
                >
                  <span className="flex items-center justify-center gap-2">
                    <IconStop size={15} />
                    Dừng Crawl
                  </span>
                </button>
              )}
            </form>
          </div>

          {/* Stats Card */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Tổng chương" value={stats.total} color="text-gray-300" glow="" />
            <StatCard label="Thành công" value={stats.success} color="text-emerald-400" glow="shadow-emerald-900/20" />
            <StatCard label="Thất bại" value={stats.failed} color="text-rose-400" glow="shadow-rose-900/20" />
          </div>
        </div>

        {/* ── RIGHT: Progress + Logs ───────────────────────────────────────── */}
        <div className="xl:col-span-3 space-y-4">

          {/* Progress Card */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Tiến Độ</h2>
              <div className="flex items-center gap-2">
                {isCrawling && (
                  <span className="flex items-center gap-1.5 text-xs text-violet-400">
                    <IconSpinner size={12} />
                    <span>Đang chạy</span>
                  </span>
                )}
                {isDone && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <IconCheckCircle size={12} />
                    <span>Hoàn thành</span>
                  </span>
                )}
                <span className={`text-2xl font-bold tabular-nums tracking-tight ${isCrawling ? "text-violet-400" : isDone ? "text-emerald-400" : "text-gray-600"}`}>
                  {crawlingProgress}%
                </span>
              </div>
            </div>

            {/* Progress bar track */}
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isDone && !isCrawling
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : "bg-gradient-to-r from-violet-600 to-fuchsia-500"
                }`}
                style={{ width: `${crawlingProgress}%` }}
                role="progressbar"
                aria-valuenow={crawlingProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>

            {/* Status message */}
            <p className={`mt-3 truncate text-xs transition-colors duration-200 ${
              isCrawling ? "text-gray-400" : isIdle ? "text-gray-600" : "text-gray-400"
            }`}>
              {statusMessage || (isIdle ? "Nhập URL và nhấn Bắt đầu Crawl để khởi chạy." : "Sẵn sàng.")}
            </p>
          </div>

          {/* Terminal Logs */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm shadow-xl overflow-hidden flex flex-col" style={{ height: "420px" }}>
            {/* Terminal header bar */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-white/[0.06] bg-black/30 px-5 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/60" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/60" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/60" />
                </div>
                <span className="text-xs font-medium text-gray-500">Nhật ký thời gian thực</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span>{logs.length} dòng</span>
                {isCrawling && <IconSpinner size={12} />}
              </div>
            </div>

            {/* Log content */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5 scroll-smooth">
              {logs.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04] text-gray-700">
                      <IconInfo size={22} />
                    </div>
                    <p className="text-gray-600">Nhật ký trống. Nhấn &ldquo;Bắt đầu Crawl&rdquo; để khởi chạy.</p>
                  </div>
                </div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="shrink-0 text-gray-700 select-none">{log.timestamp}</span>
                    <LogBadge type={log.type} />
                    <span className={
                      log.type === "success" ? "text-emerald-300" :
                      log.type === "error"   ? "text-rose-300" :
                      "text-gray-400"
                    }>
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

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({ label, value, color, glow }: { label: string; value: number; color: string; glow: string }) {
  return (
    <div className={`rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 shadow-lg ${glow}`}>
      <p className="text-xs text-gray-500 mb-1.5">{label}</p>
      <p className={`text-2xl font-bold tabular-nums tracking-tight ${color}`}>{value}</p>
    </div>
  );
}

function LogBadge({ type }: { type: "info" | "success" | "error" }) {
  if (type === "success") return (
    <span className="shrink-0 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium bg-emerald-500/15 text-emerald-400">
      <IconCheckCircle size={10} />OK
    </span>
  );
  if (type === "error") return (
    <span className="shrink-0 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium bg-rose-500/15 text-rose-400">
      <IconXCircle size={10} />ERR
    </span>
  );
  return (
    <span className="shrink-0 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium bg-white/[0.06] text-gray-500">
      <IconInfo size={10} />INF
    </span>
  );
}
