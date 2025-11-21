# TÍNH NĂNG (Mô tả ngắn gọn, dễ hiểu)

File này liệt kê các chức năng chính của backend và giải thích bằng ngôn ngữ đơn giản.

- Quản lý người dùng
  - Đăng ký, đăng nhập, cập nhật thông tin cá nhân.
  - Lưu mật khẩu an toàn (mã hóa), trả token để frontend xác thực các yêu cầu kế tiếp.

- Sản phẩm và biến thể
  - Lưu thông tin sản phẩm (tên, mô tả, ảnh, giá).
  - Hỗ trợ biến thể (variant) như màu, kích thước, cấu hình.

- Tìm kiếm và gợi ý
  - Tìm kiếm toàn văn (full-text) theo tên sản phẩm/variant.
  - Autocomplete (gợi ý khi gõ từ khóa).

- Giỏ hàng và chi tiết giỏ
  - Thêm/xóa/sửa số lượng sản phẩm trong giỏ hàng.

- Đơn hàng và thanh toán
  - Tạo đơn, lưu trạng thái (đang xử lý, đã thanh toán, đã giao).
  - Kết nối với hệ thống thanh toán (ví dụ: Zalopay, Stripe) theo cấu hình.

- Voucher / Mã giảm giá
  - Áp dụng mã giảm giá cho đơn hàng theo điều kiện.

- Đánh giá và bình luận
  - Người dùng có thể đánh giá và viết nhận xét cho sản phẩm.

- Yêu thích (Wishlist)
  - Lưu sản phẩm vào danh sách yêu thích để xem sau.

- Thông báo (Notifications)
  - Hệ thống tạo và lưu thông báo (ví dụ: đơn hàng mới, cập nhật trạng thái).
    
- Bảng điều khiển (Dashboard)
  - Các endpoint dành cho quản trị viên để xem báo cáo, thống kê.

Ghi chú: Những tính năng trên có thể có nhiều chi tiết kỹ thuật; mục này chỉ mô tả chức năng nhìn từ người dùng.

## Tính năng nổi bật (điểm nhấn kỹ thuật)

Phần này mô tả những điểm kỹ thuật nổi bật mà dự án hỗ trợ, giúp ứng dụng mạnh hơn, an toàn hơn và dễ mở rộng.

- Atomic operations & Transactions:
  - Hỗ trợ transaction (Mongoose session) cho các thao tác cần tính nguyên tử (ví dụ: trừ tồn kho + tạo đơn) để tránh tình trạng dữ liệu không đồng bộ.

- Realtime (cập nhật thời gian thực):
  - Dùng WebSocket / Socket.io để gửi thông báo tức thì (ví dụ: cập nhật trạng thái đơn, thông báo hệ thống) tới client.

- Caching & Performance (Redis):
  - Cache các truy vấn lặp (ví dụ: danh sách sản phẩm phổ biến) bằng Redis để giảm tải DB và tăng tốc độ phản hồi.

- Idempotency & Safe Retries:
  - Áp dụng khóa idempotency cho các thao tác thanh toán/webhook để tránh xử lý trùng lặp khi retries xảy ra.

- Background jobs & Queue (Bull/BullMQ):
  - Các công việc nặng/không đồng bộ (gửi email, xử lý ảnh, đồng bộ hóa bên thứ ba) chạy trong queue để không block request chính.

- Pagination & Cursor-based listing:
  - Hỗ trợ phân trang hiệu quả (limit/offset hoặc cursor) cho danh sách lớn.

- Search tuning & Fallback:
  - Sử dụng chỉ mục text, trọng số trường, và fallback (tìm trong `products` nếu `productvariants` rỗng) để đảm bảo kết quả phù hợp.

- Data validation & Schema:
  - Dùng Mongoose schema kết hợp thư viện validate (Joi/Zod) để đảm bảo dữ liệu vào luôn hợp lệ.

- Security & Access Control:
  - Role-based access control (admin, user), rate-limiting, input sanitization, Helmet và các biện pháp chống XSS/CSRF.

- Observability & Metrics:
  - Structured logs, request-id, health checks, và có thể kết nối với Prometheus/Grafana để thu metrics.

- Scalability:
  - Ứng dụng được thiết kế tĩnh (stateless) để có thể scale theo chiều ngang; session/cache lưu trên Redis; media tĩnh có thể phục vụ qua CDN.

- Bulk import/export & Admin tools:
  - Hỗ trợ import dữ liệu (CSV/JSON) và thao tác quản trị (admin) để quản lý catalog lớn.

Những tính năng này giúp backend trở nên đáng tin cậy, nhanh và dễ vận hành ở môi trường production.
