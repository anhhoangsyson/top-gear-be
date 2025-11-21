# Dashboard — README (tóm tắt)

Mục đích: Endpoint dành cho quản trị để xem báo cáo, thống kê (orders, revenue, users).

Vị trí:
- `controller/` : các endpoint trả số liệu tổng hợp.
- `service/` : logic tính toán báo cáo, aggregation queries.

Ghi chú:
- Các truy vấn báo cáo có thể nặng; khuyến nghị cache kết quả và/hoặc chạy theo lịch (cron job).
