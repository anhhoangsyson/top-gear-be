// Thư mục `src/api` chứa các module theo tính năng (feature).
// Mỗi feature thường theo pattern: router -> controller -> service -> repository -> schema
// - `router/` đăng ký các đường dẫn HTTP và middleware cho feature đó
// - `controller/` nhận request, gọi `service` và trả response
// - `service/` chứa logic nghiệp vụ, xử lý dữ liệu, gọi `repository`
// - `repository/` tương tác trực tiếp với DB (Mongoose models)
// Khi thêm feature mới:
// 1. Tạo thư mục `src/api/<feature>` theo cấu trúc trên
// 2. Đăng ký router vào `src/index.ts` (ví dụ: app.use('/api/v1/<feature>', <featureRouter>))
// 3. Thêm README ngắn tại thư mục feature để mô tả endpoints và flow
