# Wishlist — README (tóm tắt)

Mục đích: Lưu sản phẩm mà user muốn nhớ/xem sau.

Vị trí:
- `controller/`, `service/`, `repository/` tương tự pattern chung.

Endpoints tiêu biểu:
- `POST /api/v1/wishlist` — thêm sản phẩm vào wishlist.
- `GET /api/v1/wishlist` — lấy danh sách wishlist.

Ghi chú:
- Dữ liệu nhẹ, có thể cache cho trải nghiệm nhanh.
