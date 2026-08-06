export interface ScrapedChapterLinkDto {
  chapterNumber: number;
  title: string;
  url: string;
}

export interface ScrapedStoryMetadataDto {
  title: string;
  description: string;
  coverImageUrl: string;
  authorName: string;
  genres: string[];
  chapters: ScrapedChapterLinkDto[];
}

export interface ScrapeMetadataRequestDto {
  url: string;
}

export interface ScrapeChapterRequestDto {
  url: string;
  chapterNumber: number;
  title: string;
}
