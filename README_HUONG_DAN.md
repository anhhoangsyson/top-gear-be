# HƯỚNG DẪN SỬ DỤNG (Ngắn gọn, bằng tiếng Việt)

Mục đích: file này hướng dẫn nhanh cho người muốn chạy backend trên máy của mình.

1) Yêu cầu trước khi chạy
- Cài Docker Desktop (Windows: bật WSL2).
- Git (để clone repo nếu cần).

2) Sao chép file môi trường

Tạo file `.env` từ `.env.example` và điền các giá trị bí mật (không commit file `.env`).

3) Chạy toàn bộ hệ thống bằng Docker Compose (cách đơn giản nhất)

Mở terminal ở thư mục dự án rồi chạy:

```powershell
docker compose up --build
```

Lệnh trên sẽ:
- Build image backend (TypeScript -> JavaScript)
- Khởi tạo MongoDB và Redis (cấu hình có trong `docker-compose.yml`)

4) Một số lệnh hữu ích

- Xem log realtime của backend:

```powershell
docker compose logs -f backend
```

- Dừng và xóa container:

```powershell
docker compose down
```

- Chỉ rebuild backend:

```powershell
docker compose build --no-cache backend
docker compose up -d backend
```

5) Kiểm tra API nhanh

- Health check:

```powershell
curl http://localhost:3000/api/v1/health
```

- Ví dụ tìm kiếm (nếu chạy local):

```powershell
curl "http://localhost:3000/api/v1/pvariants/search?q=laptop"
```

6) Lưu ý môi trường

- Thông tin kết nối DB/Redis nằm trong `.env` (hoặc được cung cấp bởi dịch vụ hosting như Render).
- Không đẩy `.env` lên Git.

7) Chạy không dùng Docker (tùy chọn)

- Cài Node.js (phiên bản LTS, ví dụ Node 18/20), sau đó:

```powershell
npm ci
npm run build
npm run start
```

Lưu ý: phản hồi lỗi thường do thiếu biến môi trường hoặc package chưa nằm trong `dependencies`.
