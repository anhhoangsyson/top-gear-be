# Auth — README (tóm tắt)

Mục đích: Xác thực & ủy quyền (login, logout, social login, refresh token).

Vị trí chính:
- `controller/` : endpoints login/register, social callbacks.
- `service/` : xác thực credential, tạo token, refresh logic.
- `router/` : route auth và callback cho OAuth.

Endpoints tiêu biểu:
- `POST /api/v1/auth/login` — trả JWT.
- `POST /api/v1/auth/register` — đăng ký user.
- `/auth/google` (nếu có) — OAuth callback.

Ghi chú:
- Kiểm soát session/token tuỳ cấu hình: JWT stateless hoặc session + Redis.
- Xác thực middleware dùng token trong header `Authorization: Bearer <token>`.
