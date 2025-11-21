# Order Detail — README (tóm tắt)

Mục đích: Lưu chi tiết mỗi item trong order (product, variant, price, qty).

Vị trí:
- `repository/` lưu chi tiết, `service/` xử lý khi tạo order.

Usage:
- Khi tạo order, service sẽ tạo các orderDetail records kèm trạng thái và giá tại thời điểm mua.

Ghi chú:
- Lưu giá tại thời điểm mua để tránh thay đổi giá về sau làm mất lịch sử.
