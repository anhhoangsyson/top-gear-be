# Notification — README (tóm tắt)

Mục đích: Lưu và gửi thông báo cho user (in-app notifications, push, email).

Vị trí chính:
- `controller/` : lấy danh sách thông báo, đánh dấu đã đọc.
- `service/` : tạo notifications, gửi realtime qua socket.
- `repository/` : lưu vào collection `notifications`.

Luồng ví dụ:
- Khi đơn thay đổi trạng thái, order service gọi notification service để tạo và push thông báo cho user.

Ghi chú:
- Realtime: dùng Socket.io hoặc Redis pub/sub để gửi thông báo multi-instance.
