import type { Metadata } from "next";
import { HomeScreen } from "@/features/public-stories/components/home-screen";

export const metadata: Metadata = {
  title: "Trang chủ – Đọc truyện tranh online",
  description: "Đọc truyện tranh online chất lượng cao, cập nhật nhanh nhất.",
};

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    genre?: string;
    page?: string;
  }>;
}

/**
 * Home page.
 * Route: /
 * Awaits searchParams (Next.js 15/16 requirement) and passes to HomeScreen.
 */
export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  return <HomeScreen searchParams={resolvedSearchParams} />;
}
