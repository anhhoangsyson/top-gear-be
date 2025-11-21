# Comments — README (tóm tắt)

Mục đích: Quản lý bình luận cho sản phẩm/ bài viết.

Vị trí:
- `controller/` : tạo, sửa, xóa comment.
- `service/` : validate nội dung, kiểm duyệt (nếu có).
- `repository/` : collection `comments`.

Endpoints tiêu biểu:
- `POST /api/v1/comments` — thêm comment.
- `GET /api/v1/comments?productId=...` — lấy comment theo product.

Ghi chú:
- Có thể kết hợp moderation queue để duyệt comment (background job).
