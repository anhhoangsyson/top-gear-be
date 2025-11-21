// Thư mục `middlewares` chứa các middleware dùng chung cho ứng dụng.
// Một số middleware tiêu biểu:
// - authenticate: kiểm tra token/JWT và gán `req.user`
// - errorHandle: bắt lỗi từ controller và trả response tiêu chuẩn
// - upload: xử lý file upload (multer/stream)
// - validation: validate input trước khi đi vào controller
//
// Lưu ý cho người mới:
// - Middleware được đăng ký trong `src/index.ts` theo thứ tự: parser -> auth -> routes -> errorHandler
// - Nếu cần thêm middleware global (ví dụ: request logger), thêm ở `src/index.ts` trước khi register router
// - Thêm comment vào từng file middleware cụ thể để mô tả purpose và side-effects
//
// Ví dụ: `errorHandle.ts` đã có handler chuyên xử lý lỗi, đảm bảo trả mã lỗi và message rõ ràng.
