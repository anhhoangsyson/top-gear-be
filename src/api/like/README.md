# Like — README (tóm tắt)

Mục đích: Quản lý hành động thích (like) sản phẩm, bài viết.

Vị trí:
- `controller/`, `service/`, `repository/`.

Usage:
- `POST /api/v1/like` — like/unlike một item.
- `GET /api/v1/like?userId=...` — lấy danh sách item đã like.

Ghi chú:
- Dữ liệu nhỏ, có thể cache hoặc lưu dưới dạng set trong Redis cho truy vấn nhanh.
