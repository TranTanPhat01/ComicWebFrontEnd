import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { fetchStoriesPage } from "@/features/public-stories/lib/stories-page-helper";
import { StoryPagination } from "@/features/public-stories/components/story-pagination";
import { EmptyState } from "@/components/feedback/empty-state";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import type { PublicStoryListItemDto } from "@/features/public-stories/types/public-story.types";

export const metadata: Metadata = {
  title: "Truyện Hot — Đọc Nhiều Nhất",
  description: "Top truyện tranh được đọc nhiều nhất, hot nhất tại ComicWeb. Những bộ truyện nổi bật được cộng đồng yêu thích.",
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}


function HotStoryRow({ story, rank }: { story: PublicStoryListItemDto; rank: number }) {
  const isTop3 = rank <= 3;
  const coverUrl = story.coverUrl || null;
  const chapterCount = story.chapterCount ?? 0;

  return (
    <Link href={ROUTES.storyDetail(story.slug)} className={`hot-story-row${isTop3 ? " hot-story-row--top3" : ""}`}>
      <div className={`hot-story-row__rank hot-story-row__rank--${rank}`}>
        {rank <= 3 ? (
          <span className="hot-story-row__rank-medal">{rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}</span>
        ) : (
          <span>{rank}</span>
        )}
      </div>
      <div className="hot-story-row__cover">
        <ImageWithFallback
          src={coverUrl}
          alt={story.title}
          fill
          sizes="64px"
          className="hot-story-row__cover-img"
        />
      </div>
      <div className="hot-story-row__info">
        <h3 className="hot-story-row__title">{story.title}</h3>
        <div className="hot-story-row__meta">
          <span className="hot-story-row__author">{story.authorName ?? "Đang cập nhật"}</span>
          <span className="hot-story-row__dot">·</span>
          <span className="hot-story-row__chapters">Ch. {chapterCount}</span>
        </div>
        {story.genres && story.genres.length > 0 && (
          <div className="hot-story-row__tags">
            {story.genres.slice(0, 2).map((g) => (
              <span key={g} className="hot-story-row__tag">{g}</span>
            ))}
          </div>
        )}
      </div>
      <div className="hot-story-row__views">
        <span className="hot-story-row__views-icon">📚</span>
        <span className="hot-story-row__views-count">{story.chapterCount}</span>
        <span className="hot-story-row__views-label">chương</span>
      </div>
    </Link>
  );
}

export default async function HotPage({ searchParams }: PageProps) {
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;

  const result = await fetchStoriesPage(
    { page: page, pageSize: 20, sort: "-chapterCount" },
    () => true
  );

  // Sort by chapterCount descending
  const stories = [...result.stories].sort((a, b) => b.chapterCount - a.chapterCount);
  const startRank = (page - 1) * 20 + 1;

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
              <span className="breadcrumbs__current" aria-current="page">Hot</span>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <header className="list-page__header">
          <h1 className="list-page__title">
            <span className="list-page__title-icon list-page__title-icon--hot">🔥</span>
            Truyện Hot — Đọc Nhiều Nhất
          </h1>
          <p className="list-page__subtitle">
            Những bộ truyện được cộng đồng yêu thích và đọc nhiều nhất
          </p>
        </header>

        {stories.length === 0 ? (
          <EmptyState title="Chưa có dữ liệu" message="Vui lòng quay lại sau." />
        ) : (
          <>
            <div className="list-page__meta">
              <span className="list-page__count">Top {result.totalCount > 0 ? result.totalCount : stories.length} truyện được đọc nhiều nhất</span>
            </div>
            <div className="hot-story-list">
              {stories.map((story, idx) => (
                <HotStoryRow key={story.id} story={story} rank={startRank + idx} />
              ))}
            </div>
            {result.totalPages > 1 && (
              <StoryPagination currentPage={page} totalPages={result.totalPages} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
