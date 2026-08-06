# HƯỚNG DẪN VẬN HÀNH DÀNH CHO ADMIN - COMICWEB

Chào mừng bạn đến với tài liệu hướng dẫn vận hành hệ thống quản lý nội dung ComicWeb. Tài liệu này cung cấp các chỉ dẫn chi tiết từng bước giúp bạn quản lý truyện, chương, thể loại và vận hành công cụ cào truyện tự động một cách hiệu quả nhất.

---

## 1. Cơ Chế Hoạt Động Của Hệ Thống Cào Truyện (Scraper)

### ❓ Khi cào truyện, nội dung chương có tự động được lấy và cập nhật không?
* **Có, hoàn toàn tự động!** 
* Khi bạn bắt đầu cào một đường dẫn truyện (ví dụ từ `nguontruyen.com` hoặc `giotruyen.online`), hệ thống sẽ thực hiện theo 2 bước:
  1. **Lấy Thông Tin Nháp (Metadata):** Hệ thống đọc trang chi tiết truyện để lấy tên truyện, tên tác giả, ảnh bìa, danh sách các thể loại và toàn bộ danh sách liên kết (URL) của từng chương.
  2. **Tự Động Nạp Nội Dung Từng Chương:** Hệ thống duyệt qua từng liên kết chương, tự động tải mã nguồn HTML của chương đó, phân tích và bóc tách phần nội dung văn bản chính (loại bỏ quảng cáo, mã theo dõi, văn bản rác) rồi lưu trực tiếp vào cơ sở dữ liệu.
* **Cập nhật truyện có sẵn:** Nếu bạn chọn một truyện đã có trong hệ thống và tiến hành cào, hệ thống sẽ chỉ nạp thêm các chương mới mà truyện đó chưa có (không xóa hoặc đè các chương cũ), giúp bạn dễ dàng cập nhật các chương mới xuất bản.

---

## 2. Hướng Dẫn Vận Hành Nghiệp Vụ Trên Giao Diện Admin

Để người dùng có thể nhìn thấy truyện và đọc được nội dung chương trên trang công khai, bạn cần thực hiện đầy đủ các nghiệp vụ sau:

### 2.1. Cào truyện & Tự động xuất bản chương
1. Truy cập vào menu **Cào Truyện**.
2. Nhập URL chi tiết của truyện nguồn (Ví dụ: `https://giotruyen.online/truyen/trong-sinh-ga-cho-luc-tranh`).
3. Chọn đích nạp:
   * **Tạo truyện mới:** Nếu truyện này chưa từng có trong hệ thống.
   * **Nạp tiếp vào truyện cũ:** Chọn tên truyện tương ứng từ danh sách dropdown để tải thêm chương mới.
4. Tích chọn **"Tự động xuất bản chương sau khi cào thành công"** (Khuyên dùng). 
   * *Lưu ý:* Nếu chọn, toàn bộ chương sau khi cào sẽ ở trạng thái `Published` (Xuất bản) và người đọc xem được ngay. Nếu bỏ chọn, các chương sẽ lưu ở dạng `Draft` (Nháp) để bạn kiểm duyệt lại trước khi công khai.
5. Bấm **Bắt đầu Crawl** và theo dõi tiến trình chạy trên màn hình terminal.

---

### 2.2. Đăng truyện lên trang chủ cho người dùng đọc
Truyện mới cào hoặc tạo mới mặc định sẽ ở trạng thái **Draft (Nháp)** và sẽ **ẩn** đối với người đọc thông thường. Để truyện hiển thị lên trang chủ:
1. Vào menu **Quản lý truyện**.
2. Tìm truyện bạn muốn đăng và bấm nút **Sửa**.
3. Tại ô chọn **Trạng thái**, đổi từ `Nháp` thành `Đã xuất bản` (Published) hoặc `Đã hoàn thành` (Completed).
4. Bấm **Cập nhật** để lưu lại.
5. Lúc này, truyện sẽ lập tức xuất hiện trên trang chủ của người dùng.

---

### 2.3. Quản lý chương & Xuất bản hàng loạt
Nếu trước đó bạn cào truyện nhưng không bật tự động xuất bản (chương ở trạng thái Nháp), bạn có thể xuất bản nhanh bằng cách:
1. Vào menu **Quản lý truyện**, bấm nút **Chương** bên cạnh truyện cần quản lý để vào danh sách chương của truyện đó.
2. Tại đây, bạn sẽ thấy danh sách tất cả các chương hiện tại.
3. Để xuất bản nhanh toàn bộ chương nháp cùng một lúc, bấm vào nút **⚡ Xuất bản tất cả chương nháp** ở góc trên bên phải màn hình. Hệ thống sẽ tự động duyệt và chuyển trạng thái toàn bộ chương nháp sang công khai chỉ trong vài giây.

---

### 2.4. Quản lý và Khôi phục các mục đã xóa (Soft Delete)
Khi bạn bấm nút **Xóa** một truyện hoặc một chương, hệ thống sẽ thực hiện "xóa mềm" (đánh dấu đã xóa trong database chứ không xóa vĩnh viễn để tránh mất mát dữ liệu ngoài ý muốn).
1. Để xem lại hoặc khôi phục các mục đã xóa, tích chọn ô **"Hiển thị truyện đã xóa"** (trong Quản lý truyện) hoặc **"Hiển thị chương đã xóa"** (trong Quản lý chương).
2. Các mục đã xóa sẽ xuất hiện lại trong danh sách với nhãn màu đỏ mang tên **"Đã xóa"**.
3. Để đưa truyện hoặc chương đó trở lại hoạt động bình thường, chỉ cần bấm vào nút **Khôi phục**.

---

### 2.5. Quản lý thể loại (Genres)
1. Truy cập vào menu **Quản lý thể loại**.
2. Bạn có thể thêm nhanh thể loại mới bằng cách nhập **Tên thể loại**, **Slug** (đường dẫn rút gọn, ví dụ: `tien-hiep`) và **Mô tả** ở bảng bên phải rồi bấm **Lưu thể loại**.
3. Bạn cũng có thể bật/tắt hiển thị thể loại trên menu công khai bằng checkbox `"Hiển thị trên trang công khai"`.
