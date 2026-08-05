import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { fetchStoriesPage } from "@/features/public-stories/lib/stories-page-helper";
import { StoryGrid } from "@/features/public-stories/components/story-grid";
import { StoryPagination } from "@/features/public-stories/components/story-pagination";
import { EmptyState } from "@/components/feedback/empty-state";

export const metadata: Metadata = {
  title: "Truyện Đã Hoàn Thành",
  description: "Danh sách truyện tranh đã hoàn thành tại ComicWeb. Đọc trọn bộ không cần chờ đợi, update đầy đủ.",
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function CompletedPage({ searchParams }: PageProps) {
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;

  const result = await fetchStoriesPage(
    { page: page, pageSize: 12, status: "Completed" },
    (s) => s.status === "Completed"
  );

  return (
    <div className="list-page">
      <div className="container list-page__container">
        {/* Breadcrumb */}
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <ol className="breadcrumbs__list">
            <li className="breadcrumbs__item">
              <Link href={ROUTES.home} className="breadcrumbs__link">Trang chủ</Link>
            </li>
            <li className="breadcrumbs__item breadcrumbs__item--active">
              <span className="breadcrumbs__current" aria-current="page">Hoàn thành</span>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <header className="list-page__header">
          <h1 className="list-page__title">
            <span className="list-page__title-icon list-page__title-icon--completed">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Truyện Đã Hoàn Thành
          </h1>
          <p className="list-page__subtitle">
            Đọc trọn bộ — không cần chờ đợi, update đầy đủ từ đầu đến cuối
          </p>
        </header>

        {/* Info badge */}
        <div className="list-page__info-badge">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Tất cả truyện dưới đây đã kết thúc — bạn có thể đọc thẳng từ đầu đến cuối ngay!</span>
        </div>

        {result.stories.length === 0 ? (
          <EmptyState title="Chưa có truyện hoàn thành" message="Vui lòng quay lại sau." />
        ) : (
          <>
            <div className="list-page__meta">
              <span className="list-page__count">
                {result.totalCount > 0 ? `${result.totalCount} bộ truyện` : `${result.stories.length} bộ truyện`}
              </span>
            </div>
            <StoryGrid stories={result.stories} badgeType="FULL" />
            {result.totalPages > 1 && (
              <StoryPagination currentPage={page} totalPages={result.totalPages} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
