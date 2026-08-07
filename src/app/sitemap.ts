import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getPublicStories } from "@/features/public-stories/api/public-stories.api";
import { parsePaginatedEnvelope } from "@/lib/api/parse-envelope";
import type { PublicStoryListItemDto } from "@/features/public-stories/types/public-story.types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths: MetadataRoute.Sitemap = [
    {
      url: env.appUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${env.appUrl}/tim-kiem`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${env.appUrl}/moi-cap-nhat`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${env.appUrl}/hot`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${env.appUrl}/hoan-thanh`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  try {
    // Fetch dynamic story routes (up to 100 stories for sitemap v1)
    const response = await getPublicStories({ page: 1, pageSize: 100 });
    if (response.success && response.data) {
      // API Envelope parses either as paginated items or dynamic list
      const parsed = parsePaginatedEnvelope<PublicStoryListItemDto>(response.data);
      const items = parsed.items || [];
      
      const dynamicPaths: MetadataRoute.Sitemap = items.map((story: any) => ({
        url: `${env.appUrl}/truyen/${story.slug}`,
        lastModified: new Date(story.updatedAt || story.publishedAt || Date.now()),
        changeFrequency: "daily",
        priority: 0.6,
      }));

      return [...staticPaths, ...dynamicPaths];
    }
  } catch (error) {
    console.error("Failed to generate dynamic sitemap paths:", error);
  }

  return staticPaths;
}
