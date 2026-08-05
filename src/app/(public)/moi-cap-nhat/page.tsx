import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { fetchStoriesPage } from "@/features/public-stories/lib/stories-page-helper";
import { StoryGrid } from "@/features/public-stories/components/story-grid";
import { StoryPagination } from "@/features/public-stories/components/story-pagination";
import { EmptyState } from "@/components/feedback/empty-state";

export const metadata: Metadata = {
  title: "Truyện Mới Cập Nhật",
  description: "Danh sách truyện tranh mới nhất cập nhật hôm nay tại ComicWeb. Theo dõi chương mới nhất của những bộ truyện đang hot.",
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function NewUpdatesPage({ searchParams }: PageProps) {
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;

  const result = await fetchStoriesPage(
    { page: page, pageSize: 12, sort: "-updatedAt" },
    () => true // all stories sorted by updatedAt in helper
  );

  // Sort by updatedAt for fallback mode
  const stories = [...result.stories].sort(
    (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
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
              <span className="breadcrumbs__current" aria-current="page">Mới cập nhật</span>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <header className="list-page__header">
          <h1 className="list-page__title">
            <span className="list-page__title-icon list-page__title-icon--new">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            Truyện Mới Cập Nhật
          </h1>
          <p className="list-page__subtitle">
            Theo dõi những chương truyện được cập nhật mới nhất, nhanh nhất
          </p>
        </header>

        {stories.length === 0 ? (
          <EmptyState title="Chưa có truyện nào" message="Vui lòng quay lại sau." />
        ) : (
          <>
            <div className="list-page__meta">
              <span className="list-page__count">
                {result.totalCount > 0 ? `${result.totalCount} truyện` : `${stories.length} truyện`}
              </span>
            </div>
            <StoryGrid stories={stories} badgeType="NEW" />
            {result.totalPages > 1 && (
              <StoryPagination currentPage={page} totalPages={result.totalPages} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
