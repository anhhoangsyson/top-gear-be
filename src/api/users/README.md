# Users — README (tóm tắt)

Mục đích: Quản lý người dùng (đăng ký, đăng nhập, hồ sơ, quyền).

Vị trí chính trong thư mục:
- `controller/` : xử lý request liên quan user (login, register, profile).
- `service/` : logic nghiệp vụ (hash password, tạo token, cập nhật profile).
- `repository/` : tương tác với collection `users` (Mongoose model nằm trong `schema/`).
- `dto/` : định nghĩa request/response shape và validate input.
- `router/` : khai báo endpoint và middlewares (auth, role-check).

Endpoints tiêu biểu:
- `POST /api/v1/auth/register` — đăng ký.
- `POST /api/v1/auth/login` — đăng nhập trả JWT.
- `GET /api/v1/users/me` — lấy profile (cần Authorization header).

Luồng xử lý (ví dụ login):
1. Controller nhận email/password.
2. Service kiểm tra user, so sánh hash password.
3. Nếu ok, tạo JWT và trả cho client.

Ghi chú:
- Kiểm tra `src/config/passport` nếu dùng passport strategies.
- Các token/secret được cấu hình qua biến môi trường (`JWT_SECRET`).
