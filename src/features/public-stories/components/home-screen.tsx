import React, { Suspense } from "react";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { getGenres, getPublicStories, getPublicStoryBySlug } from "../api/public-stories.api";
import { FeaturedStoryHero } from "./featured-story-hero";
import { StoryFilterChips } from "./story-filter-chips";
import { StoryGrid } from "./story-grid";
import { StoryPagination } from "./story-pagination";
import { TopReadStories } from "./top-read-stories";
import { PopularGenres } from "./popular-genres";
import { CompletedStoriesSection } from "./completed-stories-section";
import { NewsletterForm } from "./newsletter-form";
import { env } from "@/lib/env";
import { DEMO_STORIES } from "../demo/demo-stories";
import { parsePaginatedEnvelope } from "@/lib/api/parse-envelope";
import type { GenreOptionDto, PublicStoryListItemDto } from "../types/public-story.types";

interface HomeScreenProps {
  searchParams?: {
    search?: string;
    genre?: string;
    page?: string;
  };
}

// Map slugs to genres for filtering when local fallback is active
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

export async function HomeScreen({ searchParams }: HomeScreenProps) {
  const search = searchParams?.search || "";
  const genre = searchParams?.genre || "";
  const page = Number(searchParams?.page) || 1;
  const pageSize = 10; // Grid of 10 items (2 rows of 5 on desktop)

  // Fetch stories matching page, search, genre parameters
  let response = await getPublicStories({
    page: page,
    pageSize: pageSize,
    query: search || undefined,
    genre: genre || undefined,
  });

  // Fetch a base list of stories for hero and sidebar
  const baseResponse = await getPublicStories({
    page: 1,
    pageSize: 20,
  });

  const genresResponse = await getGenres();

  // Initialize variables defensively to support direct arrays, paginated envelope responses, or backend custom envelopes
  let storiesList: PublicStoryListItemDto[] = [];
  let totalPages = 1;
  let totalCount = 0;
  let genres: GenreOptionDto[] = [];

  if (response.success && response.data) {
    const parsed = parsePaginatedEnvelope<PublicStoryListItemDto>(response.data);
    storiesList = parsed.items;
    totalPages = parsed.totalPages;
    totalCount = parsed.totalCount;
  }

  if (genresResponse.success && genresResponse.data) {
    const rawGenres = Array.isArray(genresResponse.data)
      ? genresResponse.data as GenreOptionDto[]
      : (genresResponse.data as { data?: GenreOptionDto[] }).data ?? [];

    const seen = new Set<string>();
    genres = [];
    rawGenres.forEach((g) => {
      const normalizedName = g.name.normalize("NFC");
      if (!seen.has(normalizedName)) {
        seen.add(normalizedName);
        genres.push({
          ...g,
          name: normalizedName,
        });
      }
    });
  }

  let baseStories: PublicStoryListItemDto[] = [];
  if (baseResponse.success && baseResponse.data) {
    baseStories = parsePaginatedEnvelope<PublicStoryListItemDto>(baseResponse.data).items;
  }

  // Fetch the specific default featured stories by their slugs in parallel
  const FEATURED_SLUGS = [
    "buoc-qua-canh-cua-la",
    "tu-nay-nguoc-huong",
    "chiec-chao-chong-dinh-nha-anh",
    "mang-song-sinh-doi-no-tong-tai",
    "hoc-ba-bi-toi-du-do-roi",
    "chong-sach-se-dung-giay-tham-dau-cua-thu-ky-toi-sat-phat-quyet-doan",
  ];

  const featuredPromises = FEATURED_SLUGS.map((slug) => getPublicStoryBySlug(slug));
  const featuredResults = await Promise.all(featuredPromises);
  const featuredStories: PublicStoryListItemDto[] = [];

  featuredResults.forEach((res) => {
    if (res.success && res.data) {
      const detail = res.data;
      featuredStories.push({
        id: detail.id,
        slug: detail.slug,
        title: detail.title,
        description: detail.description,
        coverUrl: detail.coverUrl,
        authorName: detail.authorName,
        status: detail.status,
        genres: detail.genres,
        chapterCount: detail.chapters?.length ?? 0,
        latestChapter: detail.chapters && detail.chapters.length > 0
          ? detail.chapters[detail.chapters.length - 1]
          : null,
        publishedAt: detail.publishedAt,
        updatedAt: detail.updatedAt,
        averageRating: detail.averageRating,
        ratingCount: detail.ratingCount,
        myRating: detail.myRating,
        viewCount: detail.viewCount,
      });
    }
  });

  let isFallbackMode = false;

  // Fallback to local high-fidelity demo stories in development mode when connection fails OR database is empty
  if ((!response.success || storiesList.length === 0) && env.enableDemoFallback) {
    isFallbackMode = true;

    // Filter and paginate demo stories locally
    let filteredDemo = [...DEMO_STORIES];

    if (search) {
      filteredDemo = filteredDemo.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (genre && genre !== "Tất cả") {
      filteredDemo = filteredDemo.filter((s) => {
        const storyGenres = getStoryGenres(s.slug, s.status);
        return storyGenres.includes(genre);
      });
    }

    // Sort by views / status / chapters for mock realism
    filteredDemo.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());

    // Paginate
    totalCount = filteredDemo.length;
    totalPages = Math.ceil(totalCount / pageSize);
    const startIdx = (page - 1) * pageSize;
    storiesList = filteredDemo.slice(startIdx, startIdx + pageSize);

    baseStories = [...DEMO_STORIES];
    
    // Override response success status so that JSX renders properly
    response = {
      success: true,
      status: 200,
      data: {
        items: storiesList,
        totalCount,
        pageNumber: page,
        pageSize,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };
  }

  return (
    <div className="home-layout">
      {/* Hero Header Section */}
      {(featuredStories.length > 0 || baseStories.length > 0) && !search && !genre && page === 1 && (
        <div className="home-layout__hero">
          <FeaturedStoryHero stories={featuredStories.length > 0 ? featuredStories : baseStories} />
        </div>
      )}

      {/* Main Grid Content Layout */}
      <div className="home-layout__container container">
        {/* Offline Fallback Alert Box */}
        {isFallbackMode && (
          <div className="fallback-notice-box" role="alert">
            <div className="fallback-notice-box__icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="fallback-notice-box__content">
              <h4 className="fallback-notice-box__title">Chế độ Ngoại tuyến (Offline Fallback Mode)</h4>
              <p className="fallback-notice-box__desc">
                Không thể kết nối tới ComicWeb API tại <code>{env.apiBaseUrl}</code>. Đang hiển thị dữ liệu minh họa từ các hình ảnh mẫu của bạn để lấp đầy giao diện. Vui lòng kiểm tra xem backend có đang chạy hay không.
              </p>
            </div>
          </div>
        )}

        <div className="home-layout__grid">
          {/* Row 1: New Updates + Top Read */}
          <div className="home-layout__row reveal-section">
            <div className="home-layout__row-main">
              <section className="new-updates" aria-label="Truyện mới cập nhật">
                <div className="section-header">
                  <h2 className="section-title section-title--new">
                    <svg
                      className="section-title__icon"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    {search ? "KẾT QUẢ TÌM KIẾM" : genre ? `THỂ LOẠI: ${genre.toUpperCase()}` : "TRUYỆN MỚI CẬP NHẬT"}
                  </h2>
                </div>

                {/* Genre Selection Filter Chips */}
                <StoryFilterChips activeGenre={genre || "Tất cả"} search={search} genres={genres} />

                {/* Main List Section */}
                {!response.success ? (
                  <ErrorState
                    title="Không thể tải danh sách truyện"
                    message={response.error.message}
                  />
                ) : storiesList.length === 0 ? (
                  <EmptyState
                    title="Không tìm thấy truyện phù hợp"
                    message="Vui lòng thử tìm kiếm hoặc chọn thể loại khác."
                  />
                ) : (
                  <>
                    <StoryGrid stories={storiesList} badgeType="NEW" />
                    
                    <StoryPagination
                      currentPage={page}
                      totalPages={totalPages}
                      genre={genre}
                      search={search}
                    />
                  </>
                )}
              </section>
            </div>

            <aside className="home-layout__row-side">
              {/* Top read list */}
              <TopReadStories stories={baseStories} />
            </aside>
          </div>

          {/* Row 2: Completed Stories + Popular Genres */}
          {!search && !genre && (
            <div className="home-layout__row reveal-section">
              <div className="home-layout__row-main">
                <Suspense fallback={<LoadingState message="Đang tải truyện hoàn thành..." />}>
                  <CompletedStoriesSection />
                </Suspense>
              </div>
              <aside className="home-layout__row-side">
                {/* Popular Genres grid */}
                <PopularGenres genres={genres} />
              </aside>
            </div>
          )}

          {/* Row 3: Full Width Newsletter Section */}
          <div className="home-layout__row-full reveal-section">
            <section className="newsletter-box newsletter-box--fullwidth" aria-label="Nhận thông báo truyện mới">
              <div className="newsletter-box__main-info">
                <div className="newsletter-box__icon-wrapper">
                  <svg
                    className="newsletter-box__icon"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <div className="newsletter-box__text">
                  <h3 className="newsletter-box__title">Nhận thông báo truyện mới</h3>
                  <p className="newsletter-box__desc">
                    Đăng ký email để nhận thông báo chương truyện mới nhất hoàn toàn miễn phí.
                  </p>
                </div>
              </div>
              <NewsletterForm />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
