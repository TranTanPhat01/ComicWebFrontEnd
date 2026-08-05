import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getPublicStoryBySlug } from "@/features/public-stories/api/public-stories.api";
import { getPublicChapters } from "@/features/public-chapters/api/public-chapters.api";
import { StoryDetailScreen } from "@/features/public-stories/components/story-detail-screen";
import { env } from "@/lib/env";
import { DEMO_STORIES } from "@/features/public-stories/demo/demo-stories";
import type { PublicStoryDetailDto } from "@/features/public-stories/types/public-story.types";
import type { PublicChapterListItemDto } from "@/features/public-chapters/types/public-chapter.types";
import type { ApiResponse } from "@/lib/api/api-response";
import type { PaginatedResponse } from "@/types/pagination";
import type { StorySlugParam } from "@/constants/routes";
import { parseEnvelopeData } from "@/lib/api/parse-envelope";

interface StoryPageProps {
  params: Promise<StorySlugParam>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
  }>;
}

// Helpers for fallback genre categorization
function getStoryGenres(slug: string, status: string): string[] {
  const normalized = slug.toLowerCase();
  if (normalized.includes("chong-sach-se") || normalized.includes("toan-chuc-phap-su")) {
    return ["Huyền Huyễn", "Đô Thị", "Phương Tây"];
  }
  if (normalized.includes("phieu-an") || normalized.includes("dau-pha-thuong-khung")) {
    return ["Tiên Hiệp", "Huyền Huyễn", "Đô Thị"];
  }
  if (normalized.includes("bo-la-ma-vuong") || normalized.includes("than-an-vuong-toa")) {
    return ["Huyền Huyễn", "Đấu Khí", "Phép Thuật", "Tiên Hiệp"];
  }
  if (normalized.includes("nam-sat-phong-than") || normalized.includes("vo-luyen-dinh-phong")) {
    return ["Huyền Huyễn", "Tu Chân", "Trùng Sinh", "Xuyên Không"];
  }
  if (normalized.includes("truong-mau-giao") || normalized.includes("mot-minh-ta-dau")) {
    return ["Huyền Huyễn", "Hệ Thống", "Hành Động"];
  }
  if (normalized.includes("cong-tu-am-ve")) {
    return ["Huyền Huyễn", "Đấu Trí", "Khoa Huyễn"];
  }
  return [status, "Truyện Tranh"];
}

// Map chapter titles for fallback details page
function getChapterMockTitle(slug: string, num: number): string {
  const normalized = slug.toLowerCase();
  if (normalized.includes("chong-sach-se")) {
    const titles = ["Phát Hiện Bất Thường", "Dấu Vết Trên Giấy", "Thiên Kim Hứa Thị", "Thư Ký Thâm Sâu", "Đối Chất Trực Diện", "Ly Hôn Quyết Đoán", "Chuẩn Bị Phản Công", "Bắt Đầu Hợp Tác"];
    return titles[(num - 1) % titles.length];
  }
  if (normalized.includes("phieu-an")) {
    const titles = ["Mì Tôm Đêm Khuya", "Năm Ngàn Tệ Tình Nghĩa", "Cuộc Chat Lén", "Nhận Ra Bộ Mặt", "Dứt Khoát Chia Tay", "Khởi Nghiệp Mới", "Gặp Lại Kẻ Cũ", "Lấy Lại Danh Dự"];
    return titles[(num - 1) % titles.length];
  }
  if (normalized.includes("bo-la-ma-vuong") || normalized.includes("sua-chua")) {
    const titles = ["Kỹ Năng Tháo Lắp", "Bảo Mẫu Mười Vạn", "Người Quen Cũ", "Nam Thần Bại Liệt", "Khóa Cửa Phòng", "Bắt Đầu Trị Liệu", "Cơn Thịnh Nộ", "Sự Cải Thiện Đầu Tiên"];
    return titles[(num - 1) % titles.length];
  }
  if (normalized.includes("nam-sat") || normalized.includes("nguoc-van")) {
    const titles = ["Vòng Lặp Vô Tận", "Dòng Chữ Bí Ẩn", "Lần Chết Đầu Tiên", "Quyết Định Phản Kháng", "Lần Chết Thứ Ba", "Đạn Mạc Chỉ Dẫn", "Thẩm Cận Từ", "Giành Lại Tự Do"];
    return titles[(num - 1) % titles.length];
  }
  if (normalized.includes("truong-mau-giao") || normalized.includes("than-nui")) {
    const titles = ["Thôn Thanh Nhai", "Lạc Lối", "Yêu Quái Nhỏ", "Viện Trưởng Hồ Ly", "Tô Niệm Cô Giáo", "Rắn Nhỏ Đi Học", "Bữa Ăn Yêu Quái", "Sự Bảo Hộ"];
    return titles[(num - 1) % titles.length];
  }
  if (normalized.includes("cong-tu-am-ve")) {
    const titles = ["Ác Độc Nữ Phụ", "Bò Lên Giường?", "Kế Hoạch Mới", "Mười Tám Ám Vệ", "Lão Lục Đỏ Mặt", "Thập Tam Tinh Nghịch", "Trêu Chọc Thần Sầu", "Cơ Nghiệp Lớn"];
    return titles[(num - 1) % titles.length];
  }
  return `Diễn Biến Kỳ Thú ${num}`;
}

/**
 * Caches story detail fetches to prevent duplicate calls between metadata generation and rendering.
 */
const getCachedPublicStoryBySlug = cache(async (slug: string): Promise<ApiResponse<PublicStoryDetailDto>> => {
  const response = await getPublicStoryBySlug(slug);

  if (response.success && response.data) {
    const unwrapped = parseEnvelopeData<PublicStoryDetailDto>(response.data);
    if (unwrapped) {
      return {
        ...response,
        data: unwrapped,
      };
    }
  }

  if (!response.success && env.isDevelopment) {
    const demo = DEMO_STORIES.find((s) => s.slug === slug);
    if (demo) {
      const detail: PublicStoryDetailDto = {
        id: demo.id,
        title: demo.title,
        slug: demo.slug,
        coverUrl: demo.coverUrl,
        description: demo.description,
        authorName: demo.authorName,
        status: demo.status,
        genres: getStoryGenres(demo.slug, demo.status),
        publishedAt: demo.publishedAt,
        updatedAt: demo.updatedAt,
        chapters: [], // Mock chapters list, populated via getCachedChapters separate call in FE
      };
      return {
        success: true,
        status: 200,
        data: detail,
      };
    }
  }

  return response;
});

/**
 * Custom fetcher for chapters that supports sorting and pagination with dev fallbacks.
 */
async function getCachedChapters(
  storySlug: string,
  totalChapters: number,
  page: number,
  pageSize: number,
  sort: string
): Promise<ApiResponse<PaginatedResponse<PublicChapterListItemDto>>> {
  const response = await getPublicChapters(storySlug, {
    pageNumber: page,
    pageSize,
    sortBy: sort,
  });

  // Verify and adapt custom envelope
  let chaptersList: PublicChapterListItemDto[] = [];
  let totalCount = 0;

  if (response.success && response.data) {
    const rawData = response.data as unknown;
    if (rawData && typeof rawData === "object") {
      if ("data" in rawData && Array.isArray((rawData as { data: unknown }).data)) {
        chaptersList = (rawData as { data: PublicChapterListItemDto[] }).data;
        totalCount = (rawData as { meta?: { totalItems?: number } }).meta?.totalItems || chaptersList.length;
      } else if ("items" in rawData) {
        const paginated = rawData as { items: unknown[]; totalCount?: number };
        if (Array.isArray(paginated.items)) {
          chaptersList = paginated.items as PublicChapterListItemDto[];
          totalCount = paginated.totalCount || chaptersList.length;
        }
      }
    } else if (Array.isArray(rawData)) {
      chaptersList = rawData as PublicChapterListItemDto[];
      totalCount = chaptersList.length;
    }
  }

  // Fallback to local generated chapters in development mode when connection is offline or database has no chapters
  if ((!response.success || totalCount === 0) && env.isDevelopment) {
    const mockChapters: PublicChapterListItemDto[] = [];
    for (let i = 1; i <= totalChapters; i++) {
      mockChapters.push({
        id: i,
        title: getChapterMockTitle(storySlug, i),
        slug: `chuong-${i}`,
        number: i,
        publishedAt: new Date(Date.now() - (totalChapters - i) * 12 * 3600 * 1000).toISOString(),
      });
    }

    // Apply sorting
    if (sort === "desc") {
      mockChapters.reverse();
    }

    // Apply pagination
    const mockTotalCount = mockChapters.length;
    const mockTotalPages = Math.ceil(mockTotalCount / pageSize);
    const startIdx = (page - 1) * pageSize;
    const paginatedList = mockChapters.slice(startIdx, startIdx + pageSize);

    return {
      success: true,
      status: 200,
      data: {
        items: paginatedList,
        totalCount: mockTotalCount,
        pageNumber: page,
        pageSize,
        totalPages: mockTotalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < mockTotalPages,
      },
    };
  }

  return response;
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { storySlug } = await params;
  const response = await getCachedPublicStoryBySlug(storySlug);

  if (!response.success) {
    return {
      title: "Không tìm thấy truyện - ComicWeb",
      description: "Truyện yêu cầu không tồn tại hoặc đã bị xóa khỏi hệ thống.",
    };
  }

  const story = response.data;
  const title = `${story.title} - Đọc Truyện Tranh Online | ComicWeb`;
  const desc = story.description || `Đọc truyện ${story.title} tiếng Việt bản dịch đầy đủ, sắc nét, cập nhật nhanh nhất tại ComicWeb.`;
  const url = `${env.appUrl}/truyen/${story.slug}`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: desc,
      url,
      type: "article",
      images: [
        {
          url: story.coverUrl || "/images/demo/hero-featured.webp",
          alt: story.title,
        },
      ],
    },
  };
}

/**
 * Story detail page loader.
 */
export default async function storyPage({ params, searchParams }: StoryPageProps) {
  const { storySlug } = await params;
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const sort = resolvedSearchParams.sort || "asc";
  const pageSize = 10;

  // Retrieve story details
  const storyResponse = await getCachedPublicStoryBySlug(storySlug);
  if (!storyResponse.success) {
    notFound();
  }

  const story = storyResponse.data;

  // Retrieve story chapters list
  const chaptersResponse = await getCachedChapters(
    storySlug,
    story.chapters?.length ?? 0,
    page,
    pageSize,
    sort
  );

  const nowTime = Date.now();

  return (
    <StoryDetailScreen
      story={story}
      chaptersResponse={chaptersResponse}
      currentPage={page}
      currentSort={sort}
      now={nowTime}
    />
  );
}
