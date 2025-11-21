# QUY TRÌNH (Workflow) & CÁCH HOẠT ĐỘNG MÃ NGUỒN

File này giải thích cách các chức năng chính hoạt động từ góc nhìn người dùng và cách luồng xử lý dữ liệu trong mã (dạng đơn giản).

1) Đăng ký & Đăng nhập

- Người dùng (client) gửi email/mật khẩu tới server qua endpoint `POST /api/v1/auth/register` hoặc `POST /api/v1/auth/login`.
- Server (Express) nhận yêu cầu vào controller tương ứng, controller gọi service để kiểm tra/luu dữ liệu.
- Service gọi repository (lớp tương tác trực tiếp với MongoDB) để lưu hoặc truy vấn user.
- Nếu đăng nhập thành công, server trả một `token` (JWT). Frontend lưu token này và gửi kèm trong header `Authorization` cho những yêu cầu cần xác thực.

2) Tìm kiếm & Gợi ý

- Khi người dùng gõ từ khóa, frontend gọi endpoint tìm kiếm với truy vấn `q`.
- Server thực hiện tìm kiếm toàn văn trên `productvariants` (hoặc fallback sang `products` khi cần), dùng chỉ mục text để trả kết quả nhanh.
- Kết quả trả về danh sách sản phẩm/variant phù hợp.

3) Thêm vào giỏ & Thanh toán

- Frontend gửi yêu cầu thêm sản phẩm (variant id + số lượng) vào cart.
- Server lưu cart vào MongoDB (thường liên kết với userId nếu user đã đăng nhập).
- Khi thanh toán, server tạo `order` mới và gọi cổng thanh toán (Zalopay/Stripe) theo cấu hình. Sau khi thanh toán thành công, trạng thái đơn được cập nhật.

4) Thông báo

- Các sự kiện quan trọng (ví dụ: trạng thái đơn thay đổi) tạo một thông báo trong collection `notifications`.
- Frontend có thể lấy danh sách thông báo và số lượng chưa đọc từ API.

5) Cách mã nguồn tổ chức (mô tả đơn giản)

- `Express` (HTTP server)
  - `routes` định nghĩa các đường dẫn (URL) và ánh xạ đến `controllers`.

- `Controllers`
  - Nhận request, xác thực (nếu cần), gọi `services`, và trả response.

- `Services`
  - Chứa logic nghiệp vụ (ví dụ: tính giá, áp voucher, kiểm tra tồn kho). Services tách biệt các quy tắc xử lý khỏi thao tác DB trực tiếp.

- `Repositories`
  - Là lớp/bao bọc để giao tiếp trực tiếp với MongoDB (dùng Mongoose). Nếu muốn đổi DB khác, thường chỉ cần sửa repository.

- `Config` và `Middlewares`
  - `config/` chứa cấu hình DB, Redis, Cloudinary, v.v.
  - `middlewares/` chứa xử lý lỗi, xác thực token, validate input.

- `Redis`
  - Dùng để cache (lưu tạm) một vài dữ liệu thường truy vấn nhanh hoặc để lưu session/ngắn hạn.

6) Ví dụ mô tả luồng (đơn giản)

- Người dùng bấm "Mua" trên frontend
  1. Frontend gọi `POST /api/v1/cart` để thêm item.
  2. Server controller nhận, gọi cartService.addItem(userId, productVariantId, qty).
  3. cartService kiểm tra tồn kho (bằng repo), cập nhật cart trong DB.
  4. Khi thanh toán, server tạo order, gọi cổng thanh toán, cập nhật trạng thái.

7) Mẹo hiểu nhanh cho non-IT

- Hãy tưởng tượng: Frontend là khách hàng, server là quầy bán hàng, database là tủ chứa hàng. Khách yêu cầu -> người bán kiểm tra tủ -> cập nhật và báo lại cho khách.

8) Khi cần sửa/khởi tạo tính năng mới (gợi ý cho dev yếu)

- Tìm `src/api/<feature>` (ví dụ `src/api/product`) — nơi chứa `controller`, `service`, `repository`, `schema`.
- Thay đổi logic hiếm khi cần sửa trực tiếp trong repository nếu chỉ là quy tắc hiển thị; chỉnh `service` trước.

---

Nếu bạn muốn, tôi có thể:
- Viết phiên bản cực kỳ đơn giản chỉ toàn văn (không code) cho người non-IT hoàn toàn.
- Thêm sơ đồ nhỏ (ASCII) minh họa luồng request -> controller -> service -> repo -> DB.
