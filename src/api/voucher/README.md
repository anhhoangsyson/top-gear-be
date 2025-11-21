# Voucher — README (tóm tắt)

Mục đích: Quản lý mã giảm giá, điều kiện áp dụng, số lượng, ngày hiệu lực.

Vị trí:
- `controller/` : apply voucher, validate.
- `service/` : logic tính toán giảm giá, kiểm tra điều kiện.
- `repository/` : lưu voucher, giới hạn số lần sử dụng.

Endpoints:
- `POST /api/v1/vouchers/apply` — áp voucher cho đơn hàng (validate và trả tiền giảm).

Ghi chú:
- Voucher quan trọng bảo mật và thời gian: kiểm tra idempotency và race condition khi nhiều user dùng cùng mã.
