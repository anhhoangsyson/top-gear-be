# Product — README (tóm tắt)

Mục đích: Quản lý sản phẩm chính và sản phẩm liên quan (product + product variants).

Vị trí chính:
- `controller/` : endpoints CRUD cho sản phẩm và hiển thị danh sách.
- `service/` : nghiệp vụ (tính giá, áp voucher, xử lý ảnh trước lưu).
- `repository/` : truy vấn `products` và `productvariants` (Mongoose models).
- `schema/` : định nghĩa cấu trúc dữ liệu product/productVariant.
- `router/` : đăng ký route public và admin.

Endpoints tiêu biểu:
- `GET /api/v1/products` — lấy danh sách sản phẩm (filter, pagination).
- `GET /api/v1/products/:id` — chi tiết sản phẩm.
- `POST /api/v1/products` — tạo sản phẩm (admin).

Search & Fallback:
- Tìm kiếm chính dùng `productvariants` text index; nếu không có variant phù hợp sẽ fallback sang `products` để tìm.

Ghi chú:
- Ảnh thường lưu external (Cloudinary) và link lưu trong model.
- Các thao tác nặng (resize ảnh, tạo thumbnails) nên đẩy vào background job.
