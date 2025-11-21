# Carts — README (tóm tắt)

Mục đích: Quản lý giỏ hàng người dùng.

Vị trí chính:
- `controller/` : thêm/xóa/sửa item trong cart.
- `service/` : logic kiểm tra tồn kho, tính tổng tạm thời.
- `repository/` : lưu/truy vấn collection `carts`.
- `router/` : endpoints cho user để thao tác cart.

Endpoints tiêu biểu:
- `POST /api/v1/carts` — thêm item.
- `GET /api/v1/carts` — lấy giỏ hàng hiện tại của user.
- `PUT /api/v1/carts/:id` — sửa số lượng.

Ghi chú:
- Giỏ thường liên kết với `userId` nếu user đã login; có thể hỗ trợ guest cart bằng cookie/session.
- Các kiểm tra tồn kho nên dùng transaction khi tạo order từ cart.
