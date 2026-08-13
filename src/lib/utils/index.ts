/**
 * General utility functions.
 */

/**
 * Combines class names, filtering out falsy values.
 * Minimal alternative to clsx for simple use cases.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formats a date string to a localized Vietnamese date string.
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Truncates a string to a maximum length, appending ellipsis if needed.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

/**
 * Slugify a string (basic Vietnamese-safe implementation).
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Formats a date to relative time string (e.g. "2 phút trước").
 */
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 0) return "vừa xong";

  const intervals = {
    năm: 31536000,
    tháng: 2592000,
    tuần: 604800,
    ngày: 86400,
    giờ: 3600,
    phút: 60,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      return `${count} ${unit} trước`;
    }
  }

  return "vừa xong";
}

/**
 * Translates English text from database seeds to Vietnamese.
 */
export function translateText(text: string | null | undefined): string {
  if (!text || typeof text !== "string") return "";
  const t = text.trim();

  // Mappings for unaccented titles from database
  const titleMap: Record<string, string> = {
    "Bat Dau Nhan Duoc Hang Ty Thuoc Tinh": "Bắt Đầu Nhận Được Hàng Tỷ Thuộc Tính",
    "He Thong Y Khoa Than Ky": "Hệ Thống Y Khoa Thần Kỳ",
    "Cuu Thien Kiem Ton": "Cửu Thiên Kiếm Tôn",
    "Do Thi Cam Huong": "Đô Thị Cảm Hướng",
    "Toan Chuc Phap Su": "Toàn Chức Pháp Sư",
    "Dau Pha Thuong Khung": "Đấu Phá Thương Khung",
    "Than An Vuong Toa": "Thần Ấn Vương Tọa",
    "Vo Luyen Dinh Phong": "Võ Luyện Đỉnh Phong",
    "Mot Minh Ta Dau": "Một Mình Ta Đấu",
  };

  if (titleMap[t]) return titleMap[t];

  // Mappings for English descriptions from database
  const descMap: Record<string, string> = {
    "System level up story where MC gains billions of attribute points.": 
      "Truyện thăng cấp hệ thống cực kỳ lôi cuốn, kể về hành trình nhân vật chính nhận được hàng tỷ thuộc tính sức mạnh vượt trội.",
    "A story about a young doctor who gains an amazing medical system.": 
      "Câu chuyện về một bác sĩ trẻ tuổi sở hữu hệ thống y tế thần kỳ, cứu sống hàng ngàn sinh mạng.",
    "Traditional martial arts sword cultivator striving for immortality.": 
      "Truyện tu tiên kiếm sĩ võ thuật truyền thống phấn đấu vì sự trường sinh bất tử.",
    "Urban billionaire romance and modern family struggle story.": 
      "Câu chuyện tình yêu của tỷ phú đô thị và cuộc chiến gia tộc hiện đại đầy kịch tính.",
    "A beautiful fantasy adventure story set in an ancient fantasy world.": 
      "Câu chuyện phiêu lưu kỳ ảo tuyệt đẹp lấy bối cảnh trong thế giới cổ đại huyền bí.",
  };

  if (descMap[t]) return descMap[t];

  // Keyword fallbacks
  const lower = t.toLowerCase();
  if (lower.startsWith("system level up story")) {
    return "Truyện thăng cấp hệ thống cực kỳ lôi cuốn, kể về hành trình nhân vật chính nhận được hàng tỷ thuộc tính sức mạnh vượt trội.";
  }
  if (lower.includes("traditional martial arts sword cultivator")) {
    return "Truyện tu tiên kiếm sĩ võ thuật truyền thống phấn đấu vì sự trường sinh bất tử.";
  }
  if (lower.includes("urban billionaire romance")) {
    return "Câu chuyện tình yêu của tỷ phú đô thị và cuộc chiến gia tộc hiện đại đầy kịch tính.";
  }
  if (lower.includes("beautiful fantasy adventure story")) {
    return "Câu chuyện phiêu lưu kỳ ảo tuyệt đẹp lấy bối cảnh trong thế giới cổ đại huyền bí.";
  }

  return t;
}

/**
 * Resolves an image path/URL to its fully-qualified production or development URL.
 * Safely handles absolute/relative URLs, empty paths, and converts legacy localhost hosts.
 */
export function resolveImageUrl(src?: string | null): string {
  const fallback = "/images/fallback-cover.jpg";

  if (!src?.trim()) {
    return fallback;
  }

  // Get the base API URL (handles NEXT_PUBLIC_API_URL, NEXT_PUBLIC_API_BASE_URL, and API_BASE_URL)
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    "http://localhost:8080";

  const cleanApiUrl = apiUrl.replace(/\/+$/, "");

  // Case B: If it's a localhost absolute URL, strip it and replace with cleanApiUrl
  if (
    src.startsWith("http://localhost:") ||
    src.startsWith("https://localhost:") ||
    src.startsWith("http://127.0.0.1:") ||
    src.startsWith("https://127.0.0.1:")
  ) {
    const relativePart = src.replace(/^https?:\/\/(localhost|127\.0\.0\.1):\d+/, "");
    const normalizedPath = relativePart.startsWith("/") ? relativePart : `/${relativePart}`;
    return `${cleanApiUrl}${normalizedPath}`;
  }

  // Case D: If it starts with http:// or https:// (and is not localhost), it's a valid external URL.
  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  // Case C: If it's a relative path, prefix it with the API URL.
  const normalizedPath = src.startsWith("/") ? src : `/${src}`;
  return `${cleanApiUrl}${normalizedPath}`;
}
