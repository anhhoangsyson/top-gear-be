# Cấu trúc thư mục chính của project (tóm tắt)

File này mô tả cấu trúc thư mục chính để bạn nhanh hiểu nơi chứa mã cho từng phần.

Root (gốc repo)
- `src/` : mã nguồn TypeScript của ứng dụng.
  - `src/index.ts` : entrypoint khởi tạo Express app.
  - `src/api/` : các module theo feature (mỗi thư mục là một feature/feature-area).
    - Mỗi `src/api/<feature>/` thường có các thư mục con:
      - `controller/` : xử lý HTTP request, gọi service, trả response.
      - `service/` : logic nghiệp vụ, xử lý dữ liệu, gọi repository.
      - `repository/` : tương tác trực tiếp với database (Mongoose models).
      - `dto/` : định nghĩa data transfer objects (validation/typing).
      - `router/` : khai báo route, ánh xạ path -> controller.
      - `schema/` : định nghĩa Mongoose schema / model.

  - `src/config/` : cấu hình DB, Redis, Cloudinary, passport, v.v.
  - `src/middlewares/` : các middleware chung (authenticate, error handling, upload,...)
  - `src/services/` : các service chung (cloudinary, socket, payment,...)
  - `src/types/` : định nghĩa các TypeScript types dùng chung.

- `docs/` : swagger API docs (định nghĩa endpoint theo module).
- `scripts/` : helper scripts để kiểm tra DB, list collections, v.v.
- `Dockerfile`, `docker-compose.yml` : để build và chạy bằng Docker.

Ghi chú vận hành
- Backend thiết kế theo nguyên tắc tách biệt: controller -> service -> repository, giúp dễ test và thay đổi DB nếu cần.
- Thông thường để thêm feature mới: tạo `src/api/<feature>` theo cấu trúc trên và đăng ký route trong `src/api/index.ts`.
