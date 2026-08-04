/**
 * Site-wide configuration constants.
 */
export const siteConfig = {
  name: "ComicWeb",
  description: "Đọc truyện tranh online chất lượng cao",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "vi-VN",
  author: {
    name: "ComicWeb Team",
  },
} as const;

export type SiteConfig = typeof siteConfig;
