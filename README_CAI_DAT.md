# HƯỚNG DẪN CÀI ĐẶT & CHẠY ỨNG DỤNG (Docker + Native) — Tiếng Việt

File này hướng dẫn chi tiết để nhóm của bạn có thể chạy backend trên máy cá nhân (native) hoặc bằng Docker (khuyến nghị). Các lệnh phù hợp cho Windows PowerShell (phiên bản cũ PowerShell 5.1 cũng hỗ trợ các lệnh sau).

---

MỤC LỤC
- Phần A — Yêu cầu môi trường
- Phần B — Chạy bằng Docker (recommended)
- Phần C — Chạy native (Windows PowerShell)
- Phần D — Kiểm tra, logs và troubleshooting phổ biến

---

Phần A — Yêu cầu
- Docker Desktop (Windows): bật WSL2 backend.
- (Nếu chạy native) Node.js LTS (khuyến nghị Node 18/20/22), Git, npm.
- Một terminal PowerShell với quyền người dùng bình thường là đủ.

Luôn copy file `.env.example` thành `.env` và điền các giá trị cần thiết (không commit `.env`).

---

Phần B — Chạy bằng Docker (khuyến nghị)

Lợi ích:
- Đảm bảo môi trường giống nhau cho tất cả mọi người; không cần cài Node/Mongo/Redis trên máy dev.

1) Bật Docker Desktop và WSL2.

2) Tại thư mục gốc repo, sao chép `.env.example` -> `.env` và chỉnh nếu cần (với Docker Compose, mặc định compose sẽ dùng service `mongo` và `redis`).

3) Build và khởi động toàn bộ stack (backend + mongo + redis):

```powershell
# Từ thư mục dự án
docker compose up --build
```

4) Các lệnh thường dùng:

```powershell
# Xem logs realtime (tên service là backend trong docker-compose.yml)
docker compose logs -f backend

# Dừng và xóa container
docker compose down

# Rebuild backend (không dùng cache)
docker compose build --no-cache backend
docker compose up -d backend
```

Lưu ý Docker-specific:
- Nếu khi build gặp lỗi `husky: not found` do script `prepare`, rebuild image với tùy chọn bỏ chạy script kiểu `npm ci --omit=dev --ignore-scripts` hoặc thiết lập biến môi trường `HUSKY=0` trong Dockerfile/runtime.
- Nếu mount thư mục source từ host (volume) vào container, có thể làm ẩn `node_modules` đã cài trong image; dùng named volume `node_modules` trong `docker-compose.yml` hoặc cài dependencies trong bước `docker compose up`.

---

Phần C — Chạy native (Windows PowerShell)

Ghi chú: native = chạy trên máy dev không dùng Docker. Dùng khi bạn muốn debug trực tiếp mã TypeScript hoặc không thể xài Docker.

1) Cài Node.js LTS
- Cách nhanh: cài Node từ https://nodejs.org hoặc dùng nvm-windows: https://github.com/coreybutler/nvm-windows

2) Tạo `.env` từ `.env.example` và điền đúng thông tin (MONGO_URI hoặc DB_USER/DB_PASSWORD/DB_HOST/DB_NAME; Redis thông tin nếu dùng redis).

3) Cài dependencies (PowerShell):

```powershell
# Từ thư mục dự án
npm ci
```

Ghi chú: nếu `npm ci` báo lỗi về `husky` (prepare hook) bạn có 2 lựa chọn:
- Tạm thời cài với ignore scripts (không chạy prepare):

```powershell
npm ci --ignore-scripts
```

- Hoặc thiết lập local env trước khi cài: (PowerShell)

```powershell
$env:HUSKY = '0'
npm ci
```

4) Build TypeScript -> JavaScript:

```powershell
npm run build
```

5) Chạy server production:

```powershell
npm run start
```

6) Chạy server trong môi trường dev (live reload) — nếu project có script `dev`:

```powershell
npm run dev
```

Lưu ý khi chạy native:
- Nếu gặp `MODULE_NOT_FOUND` cho module như `passport-local`, kiểm tra file `package.json` — module phải nằm trong `dependencies` (không chỉ `devDependencies`). Thêm bằng `npm i passport-local` nếu cần.
- Mongo connection errors: kiểm tra `MONGO_URI` trong `.env` và cho phép IP (nếu dùng Atlas). Nếu dùng database local, có thể cấu hình local Mongo và chỉnh `MONGO_URI` tương ứng.

---

Phần D — Kiểm tra, logs và troubleshooting

1) Health check
- Sau khi chạy, kiểm tra endpoint health (port mặc định 3000):

```powershell
curl http://localhost:3000/api/v1/health
```

2) Kiểm tra kết nối Mongo/Redis
- Kiểm tra biến môi trường thực tế đang dùng (Docker compose hoặc file `.env`).
- Với Mongo Atlas: phải thêm IP của máy / của Render (nếu deploy) vào whitelist hoặc dùng 0.0.0.0/0 tạm thời cho dev (không dùng cho production).

3) Lỗi `auth required` khi kết nối Mongo
- Thông báo này nghĩa là URI không chứa thông tin xác thực (user/password) và DB yêu cầu auth. Giải pháp:
  - Sử dụng `MONGO_URI` có username:password, hoặc
  - Điền `DB_USER`/`DB_PASSWORD` trong `.env` và đảm bảo code buildUri dùng các giá trị này.

4) Lỗi `husky: not found` khi build image
- Dùng `npm ci --ignore-scripts` trong Dockerfile runtime hoặc đặt `ENV HUSKY=0` trong Dockerfile trước khi `npm ci`.

5) Lỗi `Cannot find module '../../../../docs/users.swagger.js'` khi chạy trong container
- Đảm bảo `docs/` được copy vào image runtime (Dockerfile COPY docs ./docs) hoặc thay require sang path tương đối đúng `process.cwd()`.

6) Lỗi `Cannot find module 'passport-local'`
- Cài package: `npm i passport-local` và commit `package.json`/`package-lock.json`. Rebuild image sau khi cập nhật.

7) CORS issues khi frontend không thể gọi API
- Kiểm tra `CORS_ORIGINS` trong `.env` và ở `src/index.ts` (origin normalization). Đảm bảo origin chính xác (đầy đủ scheme + host + port) hoặc thêm host-only.

---

Gợi ý cho nhóm: bắt đầu với Docker Compose vì đơn giản — mọi người chỉ cần Docker Desktop và file `.env` đã cấu hình. Khi ai đó cần debug code TS frontend/server, họ có thể chạy native.

Nếu bạn muốn, tôi có thể:
- Tạo script PowerShell sẵn (`setup.ps1`) tự động copy `.env.example` -> `.env` và in checklist các biến cần điền.
- Hoặc sửa `Dockerfile` để đảm bảo `docs/` được copy và tránh `husky` errors.
