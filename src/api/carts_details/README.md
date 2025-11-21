# Cart Details — README (tóm tắt)

Mục đích: Chi tiết các mục trong giỏ hàng (thường là internal helpers để hiển thị chi tiết item).

Vị trí:
- `controller/`, `service/`, `repository/` tương tự `carts` nhưng tập trung vào items.

Endpoints/usage:
- Thường không có endpoint public riêng; được cart controller sử dụng để trả chi tiết item kèm thông tin product/variant.

Ghi chú:
- Nên tối ưu query (populate hoặc aggregation) để tránh gọi nhiều lần DB cho mỗi item.
