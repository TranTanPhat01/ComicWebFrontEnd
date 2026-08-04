import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminStoryById } from "@/features/admin-stories/api/admin-stories.api";
import { AdminChaptersScreen } from "@/features/admin-chapters/components/admin-chapters-screen";

interface AdminStoryChaptersPageProps {
  params: Promise<{ storyId: string }>;
}

export async function generateMetadata({ params }: AdminStoryChaptersPageProps): Promise<Metadata> {
  const { storyId } = await params;
  const response = await getAdminStoryById(storyId);
  const title = response.success ? response.data?.title ?? "Truyện" : "Truyện";
  return {
    title: `Chương: ${title} – Admin`,
  };
}

/**
 * Admin chapters management page for a specific story.
 * Route: /admin/stories/[storyId]/chapters
 */
export default async function AdminStoryChaptersPage({ params }: AdminStoryChaptersPageProps) {
  const { storyId } = await params;
  const response = await getAdminStoryById(storyId);

  if (!response.success) {
    notFound();
  }

  const storyTitle = response.data?.title ?? "Truyện";

  return <AdminChaptersScreen storyId={storyId} storyTitle={storyTitle} />;
}
