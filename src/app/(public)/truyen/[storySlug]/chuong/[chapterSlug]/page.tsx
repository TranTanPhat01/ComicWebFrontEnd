import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getPublicChapterBySlug } from "@/features/public-chapters/api/public-chapters.api";
import { getPublicStoryBySlug } from "@/features/public-stories/api/public-stories.api";
import { ChapterScreen } from "@/features/public-chapters/components/chapter-screen";
import { env } from "@/lib/env";
import { DEMO_STORIES } from "@/features/public-stories/demo/demo-stories";
import type { PublicChapterDetailDto } from "@/features/public-chapters/types/public-chapter.types";
import type { PublicStoryDetailDto } from "@/features/public-stories/types/public-story.types";
import type { ApiResponse } from "@/lib/api/api-response";
import type { ChapterSlugParam } from "@/constants/routes";
import { parseEnvelopeData } from "@/lib/api/parse-envelope";

interface ChapterPageProps {
  params: Promise<ChapterSlugParam>;
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

// Generate premium mock reading paragraphs for development fallback
function getChapterMockContent(storySlug: string, storyTitle: string, num: number): string {
  const chapterTitle = getChapterMockTitle(storySlug, num);
  return `
    <p>Gió đêm nhẹ lướt qua khung cửa sổ hé mở, mang theo hơi thở se lạnh của thành thị khi lên đèn. Đây là chương thứ ${num} trong hành trình đầy thử thách của bộ truyện <strong>${storyTitle}</strong>.</p>
    
    <div style="text-align: center; margin: 2rem 0;">
      <img src="/images/demo/hero-featured.webp" alt="Minh họa" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
    </div>

    <h3>Phần ${num}: ${chapterTitle}</h3>
    
    <p>Lâm Mộc khẽ thở dài, tay cô nắm chặt cốc trà ấm nóng để tìm kiếm chút bình yên. Phía bên kia bàn, Lục Kỳ An vẫn đang lặng im. Đôi mắt anh đen lánh và sâu thẳm, phản chiếu những đốm sáng mờ ảo của chiếc đèn ngủ dịu nhẹ. Không khí im lặng kéo dài đến mức nghe rõ cả tiếng lá rơi ngoài sân nhỏ.</p>
    
    <blockquote>"Mỗi con đường chúng ta lựa chọn đi qua đều để lại những vết hằn sâu đậm. Dẫu có muôn vàn trắc trở, việc dừng bước chưa bao giờ là giải pháp."</blockquote>
    
    <p>Câu nói ấy của anh như tiếp thêm cho cô một luồng dũng khí mới. Cô biết mình cần phải quyết đoán. Vụ án ly hôn chấn động cùng những bí mật đằng sau giấy thấm dầu thư ký hay những phiếu ăn năm ngàn tệ rách nát đều đã phơi bày. Ngày mai, mọi chuyện sẽ phải được giải quyết dứt điểm trước pháp luật.</p>
    
    <p>Từ góc văn phòng của viện trưởng hồ yêu tôn quý, ánh trăng bạc rọi qua khe rèm vẽ nên những vệt sáng dài trên sàn gỗ bóng loáng. Một vài bé rắn và tiểu yêu tinh bé nhỏ nghịch ngợm đang lén lút quan sát từ sau chiếc kệ sách, làm không khí căng thẳng giảm bớt phần nào.</p>
    
    <p>Cô đặt cốc trà xuống bàn, nhìn thẳng vào anh và nở một nụ cười nhẹ nhõm. Một tương lai mới, dẫu khó khăn, đang đón chào họ ở phía trước.</p>
  `;
}

/**
 * Cached function to fetch chapter detail, avoiding double requests.
 */
const getCachedPublicChapter = cache(async (
  storySlug: string,
  chapterSlug: string
): Promise<ApiResponse<PublicChapterDetailDto>> => {
  const response = await getPublicChapterBySlug(storySlug, chapterSlug);

  if (response.success && response.data) {
    const unwrapped = parseEnvelopeData<PublicChapterDetailDto>(response.data);
    if (unwrapped) {
      return {
        ...response,
        data: unwrapped,
      };
    }
  }

  if (!response.success && env.enableDemoFallback) {
    const demoStory = DEMO_STORIES.find((s) => s.slug === storySlug);
    if (demoStory) {
      // Parse chapter number from slug: chuong-N
      const parts = chapterSlug.split("-");
      const num = Number(parts[parts.length - 1]) || 1;

      const previousChapter = num > 1 ? { slug: `chuong-${num - 1}`, number: num - 1, title: getChapterMockTitle(storySlug, num - 1) } : null;
      const nextChapter = num < demoStory.chapterCount ? { slug: `chuong-${num + 1}`, number: num + 1, title: getChapterMockTitle(storySlug, num + 1) } : null;

      const detail: PublicChapterDetailDto = {
        id: num,
        story: {
          id: demoStory.id,
          slug: demoStory.slug,
          title: demoStory.title,
        },
        slug: chapterSlug,
        number: num,
        title: getChapterMockTitle(storySlug, num),
        content: getChapterMockContent(storySlug, demoStory.title, num),
        publishedAt: new Date(Date.now() - (demoStory.chapterCount - num) * 12 * 3600 * 1000).toISOString(),
        previousChapter,
        nextChapter,
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
 * Cached function to fetch the story details including chapters.
 */
const getCachedStory = cache(async (storySlug: string) => {
  const response = await getPublicStoryBySlug(storySlug);

  if (response.success && response.data) {
    const unwrapped = parseEnvelopeData<PublicStoryDetailDto>(response.data);
    if (unwrapped) {
      return {
        ...response,
        data: unwrapped,
      };
    }
  }

  if (!response.success && env.enableDemoFallback) {
    const demo = DEMO_STORIES.find((s) => s.slug === storySlug);
    if (demo) {
      return {
        success: true,
        status: 200,
        data: {
          title: demo.title,
          chapters: Array.from({ length: demo.chapterCount }, (_, i) => ({
            id: i + 1,
            slug: `chuong-${i + 1}`,
            number: i + 1,
            title: `Chương ${i + 1}`,
            publishedAt: null,
          })),
        } as unknown as PublicStoryDetailDto,
      };
    }
  }
  return response;
});

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { storySlug, chapterSlug } = await params;
  
  const [chapterRes, storyRes] = await Promise.all([
    getCachedPublicChapter(storySlug, chapterSlug),
    getCachedStory(storySlug),
  ]);

  if (!chapterRes.success) {
    return {
      title: "Chương không tồn tại - ComicWeb",
    };
  }

  const chapter = chapterRes.data;
  const storyTitle = storyRes.success ? storyRes.data.title : "Truyện";
  const title = `Chương ${chapter.number}${chapter.title ? `: ${chapter.title}` : ""} - ${storyTitle} | ComicWeb`;
  const desc = `Đọc chương ${chapter.number} truyện ${storyTitle} online bản dịch chất lượng cao, cập nhật nhanh nhất tại ComicWeb.`;
  const url = `${env.appUrl}/truyen/${storySlug}/chuong/${chapter.slug}`;

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
          url: "/images/demo/hero-featured.webp",
          alt: title,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Chapter reader page default route loader.
 */
export default async function chapterPage({ params }: ChapterPageProps) {
  const { storySlug, chapterSlug } = await params;

  // Retrieve chapter content
  const chapterResponse = await getCachedPublicChapter(storySlug, chapterSlug);
  if (!chapterResponse.success) {
    notFound();
  }

  // Retrieve story details for title + chapters dropdown
  const storyResponse = await getCachedStory(storySlug);
  const storyData = storyResponse.success ? storyResponse.data : null;
  const storyTitle = storyData?.title ?? "Truyện";
  const allChapters = storyData?.chapters
    ? [...storyData.chapters]
        .sort((a, b) => a.number - b.number)
        .map((c) => ({
          slug: c.slug,
          number: c.number,
          title: c.title ?? "",
        }))
    : [];

  return (
    <ChapterScreen
      chapter={chapterResponse.data}
      storySlug={storySlug}
      storyTitle={storyTitle}
      allChapters={allChapters}
      currentChapterSlug={chapterSlug}
    />
  );
}
