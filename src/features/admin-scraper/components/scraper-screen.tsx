"use client";

import { useEffect, useState, useRef } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { getScrapedMetadata, importScrapedChapter } from "../api/admin-scraper.api";
import { getAdminStoriesBrowser, createAdminStory } from "@/features/admin-stories/api/admin-stories-browser.api";
import type { AdminStoryListItemDto } from "@/features/admin-stories/types/admin-story.types";
// Inline SVG Icons for self-contained, dependency-free compilation
function PlayIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function SquareIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
    </svg>
  );
}

function LoaderIcon({ className = "w-4 h-4 animate-spin" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} xmlns="http://www.w3.org/2000/svg">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

interface LogEntry {
  type: "info" | "success" | "error";
  message: string;
  timestamp: string;
}

export function AdminScraperScreen() {
  const [url, setUrl] = useState("");
  const [stories, setStories] = useState<AdminStoryListItemDto[]>([]);
  const [selectedStoryId, setSelectedStoryId] = useState<string>("new"); // "new" or story ID string
  const [loadingStories, setLoadingStories] = useState(true);

  // Crawl states
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlingProgress, setCrawlingProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Abort control ref
  const shouldAbortRef = useRef(false);

  useEffect(() => {
    async function loadStories() {
      try {
        const response = await getAdminStoriesBrowser({ page: 1, pageSize: 250 });
        if (response.success && response.data) {
          const raw = response.data as any;
          if (Array.isArray(raw.items)) {
            setStories(raw.items);
          } else if (Array.isArray(raw)) {
            setStories(raw);
          }
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
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [{ type, message, timestamp: time }, ...prev]);
  };

  const handleStop = () => {
    shouldAbortRef.current = true;
    addLog("error", "Đã nhận lệnh yêu cầu DỪNG crawl từ quản trị viên.");
    setStatusMessage("Đang dừng...");
  };

  const handleStartCrawl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Vui lòng nhập URL truyện nguồn.");
      return;
    }

    setIsCrawling(true);
    setCrawlingProgress(0);
    setError(null);
    setLogs([]);
    shouldAbortRef.current = false;

    addLog("info", `Bắt đầu cào thông tin truyện từ: ${url}`);
    setStatusMessage("Đang lấy thông tin truyện và danh sách chương...");

    try {
      // Step 1: Scrape story metadata
      const metaResponse = await getScrapedMetadata({ url: url.trim() });
      if (!metaResponse.success) {
        throw new Error(metaResponse.error?.message || "Không thể lấy thông tin truyện.");
      }
      if (!metaResponse.data) {
        throw new Error("Dữ liệu truyện trả về trống.");
      }

      const meta = metaResponse.data;
      addLog("success", `Đã lấy thành công metadata. Tên truyện: "${meta.title}" | Tác giả: ${meta.authorName}`);
      addLog("info", `Tìm thấy tổng cộng ${meta.chapters.length} chương truyện cần nạp.`);

      // Step 2: Establish Target Story ID
      let storyId: number;
      if (selectedStoryId === "new") {
        setStatusMessage("Đang tạo truyện mới trong cơ sở dữ liệu...");
        addLog("info", "Đang tiến hành tạo truyện mới...");

        const createResponse = await createAdminStory({
          title: meta.title,
          slug: "", // Backend handles slug generation from title
          description: meta.description,
          coverImageUrl: meta.coverImageUrl,
          authorName: meta.authorName,
          genres: meta.genres,
        });

        if (!createResponse.success) {
          throw new Error(createResponse.error?.message || "Lỗi khi tạo truyện mới.");
        }
        if (!createResponse.data) {
          throw new Error("Không nhận được phản hồi dữ liệu truyện mới từ máy chủ.");
        }

        storyId = createResponse.data.id;
        addLog("success", `Tạo truyện thành công! ID truyện mới: ${storyId}`);
      } else {
        storyId = parseInt(selectedStoryId, 10);
        addLog("info", `Sử dụng truyện có sẵn với ID: ${storyId}`);
      }

      // Step 3: Loop and Scrape Chapters sequentially
      const total = meta.chapters.length;
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < total; i++) {
        if (shouldAbortRef.current) {
          addLog("error", `Crawl bị hủy giữa chừng. Tổng số chương đã nạp thành công: ${successCount}/${total}`);
          break;
        }

        const chapter = meta.chapters[i];
        setStatusMessage(`Đang nạp chương ${i + 1}/${total}: ${chapter.title}...`);
        addLog("info", `[Nạp ${i + 1}/${total}] ${chapter.title}`);

        try {
          const importResponse = await importScrapedChapter(storyId, {
            url: chapter.url,
            chapterNumber: chapter.chapterNumber,
            title: chapter.title,
          });

          if (importResponse.success) {
            successCount++;
            addLog("success", `✓ Thành công nạp: ${chapter.title}`);
          } else {
            failCount++;
            addLog("error", `✗ Lỗi nạp chương "${chapter.title}": ${importResponse.error?.message || "Không rõ nguyên nhân"}`);
          }
        } catch (chapterErr: any) {
          failCount++;
          addLog("error", `✗ Lỗi hệ thống khi nạp "${chapter.title}": ${chapterErr.message || chapterErr}`);
        }

        setCrawlingProgress(Math.round(((i + 1) / total) * 100));
      }

      setStatusMessage("Hoàn thành quá trình import.");
      addLog("success", `Quá trình crawl kết thúc. Thành công: ${successCount}/${total}. Thất bại: ${failCount}.`);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã xảy ra lỗi không xác định.");
      addLog("error", `Lỗi nghiêm trọng: ${err.message || err}`);
      setStatusMessage("Quá trình crawl bị gián đoạn do lỗi.");
    } finally {
      setIsCrawling(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cào Truyện Tự Động"
        description="Nạp truyện và chương tự động từ các nguồn trực tuyến (hỗ trợ nguontruyen.com)"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left pane - Config Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1e1e38] border border-[#2d2d54] rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4">Cấu hình Crawl</h2>
            
            <form onSubmit={handleStartCrawl} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Đường dẫn truyện nguồn (URL)
                </label>
                <input
                  type="url"
                  className="w-full bg-[#16162a] border border-[#2d2d54] text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all placeholder:text-gray-600"
                  placeholder="https://nguontruyen.com/ten-truyen.html"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isCrawling}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Mục tiêu nhập liệu
                </label>
                {loadingStories ? (
                  <div className="flex items-center space-x-2 text-sm text-gray-400 py-2">
                    <LoaderIcon className="w-4 h-4 animate-spin text-violet-500" />
                    <span>Đang tải danh sách truyện...</span>
                  </div>
                ) : (
                  <select
                    className="w-full bg-[#16162a] border border-[#2d2d54] text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"
                    value={selectedStoryId}
                    onChange={(e) => setSelectedStoryId(e.target.value)}
                    disabled={isCrawling}
                  >
                    <option value="new">+ Tự động tạo truyện mới</option>
                    {stories.map((story) => (
                      <option key={story.id} value={story.id}>
                        [ID {story.id}] {story.title}
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Nếu chọn Tạo mới, hệ thống sẽ tự động quét lấy ảnh bìa, tên truyện, tác giả và thể loại từ link nguồn.
                </p>
              </div>

              {error && (
                <div className="bg-red-950/40 border border-red-900/60 text-red-200 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              {!isCrawling ? (
                <button
                  type="submit"
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.98]"
                >
                  <PlayIcon className="w-4 h-4" />
                  <span>Bắt đầu Crawl</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStop}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.98]"
                >
                  <SquareIcon className="w-4 h-4" />
                  <span>Dừng Crawl</span>
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right pane - Status & Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress bar */}
          <div className="bg-[#1e1e38] border border-[#2d2d54] rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-2">Tiến độ cào chương</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">
                  {statusMessage || (isCrawling ? "Đang chuẩn bị..." : "Chưa khởi chạy")}
                </span>
                <span className="text-violet-400 font-bold text-base">{crawlingProgress}%</span>
              </div>

              <div className="w-full bg-[#16162a] rounded-full h-3.5 border border-[#2d2d54] overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-full rounded-full transition-all duration-300 relative"
                  style={{ width: `${crawlingProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Logs Terminal */}
          <div className="bg-[#1e1e38] border border-[#2d2d54] rounded-xl p-6 shadow-lg flex flex-col h-[400px]">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center justify-between">
              <span>Nhật ký thời gian thực</span>
              {isCrawling && <LoaderIcon className="w-4 h-4 animate-spin text-violet-400" />}
            </h2>

            <div className="flex-1 bg-[#121224] border border-[#1d1d36] rounded-lg p-4 font-mono text-xs overflow-y-auto space-y-2.5 flex flex-col-reverse">
              {logs.length === 0 ? (
                <div className="text-gray-600 italic text-center py-10">
                  Nhật ký trống. Nhấn "Bắt đầu Crawl" để khởi chạy chương trình.
                </div>
              ) : (
                logs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start space-x-2 leading-relaxed ${
                      log.type === "success"
                        ? "text-emerald-400"
                        : log.type === "error"
                        ? "text-rose-400"
                        : "text-gray-300"
                    }`}
                  >
                    <span className="text-gray-600 select-none">[{log.timestamp}]</span>
                    <span>{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
