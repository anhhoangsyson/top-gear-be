# Rating — README (tóm tắt)

Mục đích: Quản lý đánh giá (rating) và điểm số trung bình cho sản phẩm.

Vị trí:
- `controller/` : submit rating, get ratings.
- `service/` : tính điểm trung bình sau mỗi rating, cập nhật product.
- `repository/` : collection `ratings`.

Ghi chú:
- Cập nhật điểm trung bình có thể chạy trong transaction hoặc queue để tránh blocking request.
