import type { PublicStoryListItemDto } from "../types/public-story.types";

/**
 * High-fidelity demo stories based on the user's uploaded illustrations 
 * and translated titles from artsflight.com/list.
 */
export const DEMO_STORIES: PublicStoryListItemDto[] = [
  {
    id: "demo-story-1",
    title: "Chồng Sạch Sẽ Dùng Giấy Thấm Dầu Của Thư Ký, Tôi Sát Phạt Quyết Đoán",
    slug: "chong-sach-se-dung-giay-tham-dau-cua-thu-ky-toi-sat-phat-quyet-doan",
    coverImageUrl: "/images/demo/cover-huyen-huyen-01.webp",
    description: "Kết hôn 5 năm, người chồng Cố Trạch Xuyên nổi tiếng có chứng sạch sẽ nghiêm trọng, thế nhưng lại dùng chung giấy thấm dầu với nữ thư ký. Hứa Tri Hạ dứt khoát ly hôn, vượt qua muôn vàn âm mưu hãm hại để lột trần bộ mặt của渣 nam và tiểu tam trước pháp luật. Một câu chuyện vạch trần báo thù vô cùng sảng khoái.",
    authorName: "Thất Miêu",
    status: "Completed",
    genres: ["Huyền Huyễn", "Đô Thị", "Đấu Trí"],
    totalChapters: 120,
    viewCount: 1850000,
    updatedAt: new Date(Date.now() - 2 * 60000).toISOString(), // 2 minutes ago
  },
  {
    id: "demo-story-2",
    title: "Phiếu Ăn Năm Ngàn Tệ",
    slug: "phieu-an-nam-ngan-te",
    coverImageUrl: "/images/demo/cover-do-thi-01.webp",
    description: "Tăng ca đến nửa đêm than thở với bạn trai, anh ta liền chuyển khoản 5000 tệ và bảo 'anh nuôi em', nhưng hôm sau lại bị cô phát hiện anh ta đang chế giễu mình trong nhóm chat anh em. Cô mang theo bằng chứng nợ nần phản kích đầy ngoạn mục, lấy lại lòng tự tôn và hiểu rõ phiếu ăn đích thực nhất chính là tự bản thân mình.",
    authorName: "Đông Phương",
    status: "Ongoing",
    genres: ["Đô Thị", "Hệ Thống", "Khoa Huyễn"],
    totalChapters: 85,
    viewCount: 985000,
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
  },
  {
    id: "demo-story-3",
    title: "Bố Là Ma Vương Sửa Chữa",
    slug: "bo-la-ma-vuong-sua-chua",
    coverImageUrl: "/images/demo/cover-tien-hiep-01.webp",
    description: "Tôi từ nhỏ đã thích tháo dỡ đồ đạc, tốt nghiệp đi làm bảo mẫu lương tháng mười vạn. Ngày đầu đi làm dùng kẹp tăm mở khóa cửa phòng, không ngờ lại phát hiện cố chủ là nam thần thời học sinh Lục Kỳ An. Sau tai nạn bại liệt anh ta vô cùng cáu gắt, tôi dùng kỹ năng sửa chữa để cảm hóa và giúp anh ta đứng lên lần nữa.",
    authorName: "Bán Hạ",
    status: "Ongoing",
    genres: ["Tiên Hiệp", "Huyền Huyễn", "Đấu Khí"],
    totalChapters: 45,
    viewCount: 641000,
    updatedAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
  },
  {
    id: "demo-story-4",
    title: "Năm Sát Phong Thần: Nữ Chính Ngược Văn Không Phương Bồi Nữa",
    slug: "nam-sat-phong-than-nu-chinh-nguoc-van-khong-phuong-boi-nua",
    coverImageUrl: "/images/demo/cover-xuyen-khong-01.webp",
    description: "Tô Uyển Tình là nữ chính trong truyện ngược, mẹ cô vì cứu nam chính Thẩm Cận Từ mà qua đời, bản thân cô thì rơi vào vòng lặp cốt truyện vô tận. Tự sát hay phản kháng đều vô dụng, cho đến khi bầu trời phủ đầy đạn mạc hiển thị dòng chữ 'Giết hắn đi'. Cô đã giết hắn 5 lần để phá vỡ vòng lặp, giành lại cuộc đời.",
    authorName: "Sở Cuồng",
    status: "Completed",
    genres: ["Xuyên Không", "Huyền Huyễn", "Trùng Sinh"],
    totalChapters: 195,
    viewCount: 1240000,
    updatedAt: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
  },
  {
    id: "demo-story-5",
    title: "Trường Mẫu Giáo Thần Núi",
    slug: "truong-mau-giao-than-nui",
    coverImageUrl: "/images/demo/cover-he-thong-01.webp",
    description: "Cô giáo mầm non thất nghiệp Tô Niệm vô tình lạc vào thôn Thanh Nhai, phát hiện học sinh ở đây toàn là rắn, bọ ngựa, thằn lằn lửa nhỏ yêu quái. Viện trưởng hồ yêu Hồ Ly ôn nhu bí ẩn, các em nhỏ ngây thơ đáng yêu cùng sự bảo hộ của Thần Núi mang đến câu chuyện ấm áp và ngọt ngào.",
    authorName: "Mộc Tử",
    status: "Ongoing",
    genres: ["Hệ Thống", "Huyền Huyễn", "Hành Động"],
    totalChapters: 68,
    viewCount: 812000,
    updatedAt: new Date(Date.now() - 35 * 60000).toISOString(), // 35 minutes ago
  },
  {
    id: "demo-story-6",
    title: "Công Tử, Ám Vệ Của Ngài Trộm Nhà Rồi!",
    slug: "cong-tu-am-ve-cua-ngai-trom-nha-roi",
    coverImageUrl: "/images/demo/hero-featured.webp",
    description: "Xuyên thành ác độc nữ phụ, đạn mạc mách bảo nếu bò lên giường nam chính sẽ bị đưa đến chỗ nhân vật phản diện hung ác. Quyết định từ bỏ nam chính, ngược lại đi công lược 18 vị ám vệ bên cạnh công tử! Từ lão lục đến thập tam, ai nấy đều bị cô trêu chọc đến đỏ mặt.",
    authorName: "Thanh Phong",
    status: "Completed",
    genres: ["Huyền Huyễn", "Đấu Trí", "Khoa Huyễn"],
    totalChapters: 154,
    viewCount: 1420000,
    updatedAt: new Date(Date.now() - 50 * 60000).toISOString(), // 50 minutes ago
  },
  {
    id: "demo-story-7",
    title: "Về Việc Tôi Bị Bắt Sau Khi Chết Vì Quá Nhớ Dai",
    slug: "ve-viec-toi-bi-bat-sau-khi-chet-vi-qua-nho-dai",
    coverImageUrl: "/images/demo/cover-khoa-huyen-01.webp",
    description: "Lâm Tiểu Thảo đột tử vì tăng ca xuống địa phủ, lại vì nhớ rõ mồn một thời gian chết mà bị bắt làm nghi phạm trộm thời gian. Cô phát hiện mình là 'người bấm giờ' hiếm gặp có khả năng ngưng đọng thời gian, từ đó bắt đầu hành trình phá án tại cõi âm vô cùng ly kỳ và hài hước.",
    authorName: "Phong Thần",
    status: "Ongoing",
    genres: ["Khoa Huyễn", "Đô Thị", "Huyền Huyễn"],
    totalChapters: 92,
    viewCount: 520000,
    updatedAt: new Date(Date.now() - 90 * 60000).toISOString(), // 1.5 hours ago
  }
];
