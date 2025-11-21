# Order — README (tóm tắt)

Mục đích: Xử lý tạo đơn, quản lý trạng thái đơn và tích hợp thanh toán.

Vị trí chính:
- `controller/` : endpoint tạo đơn, xem đơn, cập nhật trạng thái (admin).
- `service/` : logic tạo order, tính giá, áp voucher, giảm tồn kho.
- `repository/` : thao tác collection `orders`.
- `router/` : đăng ký các route order.

Endpoints tiêu biểu:
- `POST /api/v1/orders` — tạo order (từ cart).
- `GET /api/v1/orders/:id` — chi tiết order.
- `PUT /api/v1/orders/:id/status` — cập nhật trạng thái (admin/webhook).

Ghi chú vận hành:
- Sử dụng transaction khi giảm tồn kho và tạo order để tránh race condition.
- Thanh toán thường xử lý async qua webhook; áp idempotency key để tránh xử lý lặp.
