# Location — README (tóm tắt)

Mục đích: Quản lý tỉnh/ thành, quận/huyện, địa chỉ giao hàng.

Vị trí:
- `controller/`, `service/`, `repository/`.

Usage:
- `GET /api/v1/locations` — lấy danh sách tỉnh/thành hoặc quận theo parent.

Ghi chú:
- Dữ liệu địa lý ít thay đổi; lưu static hoặc cache để tăng tốc.
