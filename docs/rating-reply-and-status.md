# Rating Reply và Status Management - Implementation Guide

## Tổng quan thay đổi

Đã cập nhật hệ thống rating để hỗ trợ:
1. **Admin Reply** - Admin có thể trả lời đánh giá của khách hàng
2. **Status Management** - Quản lý trạng thái hiển thị rating (visible/hidden)

## Schema Changes

### IRating Interface
```typescript
export interface IRating extends Document {
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  laptopId?: Types.ObjectId | null;
  rating: number; // 1-5
  comment?: string;
  status: RatingStatus; // MỚI: Quản lý hiển thị
  adminReply?: IAdminReply; // MỚI: Reply từ admin
  createdAt: Date;
  updatedAt: Date;
}
```

### New Types
```typescript
export enum RatingStatus {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
}

export interface IAdminReply {
  content: string;
  adminId: Types.ObjectId;
  repliedAt: Date;
}
```

## API Endpoints

### 1. Admin Reply to Rating
**POST** `/api/v1/rating/admin/:id/reply`

**Headers:**
- Authorization: Bearer `<ADMIN_TOKEN>`

**Body:**
```json
{
  "content": "Cảm ơn bạn đã đánh giá. Chúng tôi rất vui khi bạn hài lòng với sản phẩm!"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "_id": "rating_id",
    "rating": 5,
    "comment": "Sản phẩm tuyệt vời!",
    "adminReply": {
      "content": "Cảm ơn bạn...",
      "adminId": {
        "_id": "admin_id",
        "fullname": "Admin Name",
        "email": "admin@example.com"
      },
      "repliedAt": "2025-11-26T10:00:00.000Z"
    }
  },
  "message": "Trả lời đánh giá thành công"
}
```

### 2. Update Admin Reply
**PATCH** `/api/v1/rating/admin/:id/reply`

**Headers:**
- Authorization: Bearer `<ADMIN_TOKEN>`

**Body:**
```json
{
  "content": "Updated reply content"
}
```

### 3. Delete Admin Reply
**DELETE** `/api/v1/rating/admin/:id/reply`

**Headers:**
- Authorization: Bearer `<ADMIN_TOKEN>`

**Response 200:**
```json
{
  "success": true,
  "data": { /* rating without adminReply */ },
  "message": "Xóa trả lời thành công"
}
```

### 4. Update Rating Status
**PATCH** `/api/v1/rating/admin/:id/status`

**Headers:**
- Authorization: Bearer `<ADMIN_TOKEN>`

**Body:**
```json
{
  "status": "hidden"  // hoặc "visible"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "_id": "rating_id",
    "status": "hidden",
    // ... other fields
  },
  "message": "Cập nhật trạng thái thành công"
}
```

### 5. Get Ratings with Status Filter
**GET** `/api/v1/rating/admin/all?status=hidden`

**Query Parameters:**
- `status`: `visible` hoặc `hidden` (optional)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `userId`: Filter by user
- `laptopId`: Filter by laptop
- `orderId`: Filter by order
- `rating`: Filter by rating (1-5)

## Use Cases

### Use Case 1: Admin trả lời đánh giá tích cực
```bash
# Admin thấy đánh giá 5 sao và muốn cảm ơn khách hàng
curl -X POST "https://api.example.com/api/v1/rating/admin/rating123/reply" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Cảm ơn bạn đã tin tưởng và sử dụng sản phẩm của chúng tôi! 🎉"
  }'
```

### Use Case 2: Ẩn đánh giá không phù hợp
```bash
# Admin thấy đánh giá có nội dung không phù hợp
curl -X PATCH "https://api.example.com/api/v1/rating/admin/rating456/status" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "hidden"
  }'
```

### Use Case 3: Admin reply đánh giá tiêu cực và ẩn reply
```bash
# Bước 1: Reply để giải quyết vấn đề
curl -X POST "https://api.example.com/api/v1/rating/admin/rating789/reply" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Rất xin lỗi vì trải nghiệm không tốt. Chúng tôi đã liên hệ với bạn để hỗ trợ."
  }'

# Bước 2: Nếu reply không phù hợp, có thể ẩn rating
curl -X PATCH "https://api.example.com/api/v1/rating/admin/rating789/status" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "hidden"
  }'
```

## Repository Methods

### New Methods Added

```typescript
// Reply Management
addAdminReply(ratingId, adminId, content): Promise<IRating>
updateAdminReply(ratingId, content): Promise<IRating>
deleteAdminReply(ratingId): Promise<IRating>

// Status Management
updateRatingStatus(ratingId, status): Promise<IRating>

// Updated Methods
findRatingsByLaptop(laptopId, page, limit, includeHidden): Promise<...>
// includeHidden = false (default): Chỉ lấy rating visible
// includeHidden = true: Lấy tất cả rating (dành cho admin)
```

## Notifications

### Admin Reply Notification
Khi admin reply đánh giá, user sẽ nhận được notification:
```json
{
  "type": "rating",
  "title": "💬 Admin đã trả lời đánh giá của bạn",
  "message": "Admin đã trả lời đánh giá của bạn",
  "data": {
    "ratingId": "rating_id",
    "replyContent": "Cảm ơn bạn..."
  },
  "link": "/account/ratings/rating_id"
}
```

## Migration Notes

### Database Migration
Các rating hiện tại sẽ tự động có:
- `status: "visible"` (default value)
- `adminReply: undefined` (chưa có reply)

**Không cần migration script** vì schema có default values.

### Backward Compatibility
- Tất cả API cũ vẫn hoạt động bình thường
- Public endpoint (`/laptop/:laptopId`) chỉ trả về rating có `status: "visible"`
- Admin endpoint (`/admin/all`) có thể filter theo status

## Testing Checklist

- [ ] Admin có thể reply đánh giá
- [ ] Admin có thể update reply
- [ ] Admin có thể delete reply
- [ ] Admin có thể ẩn/hiện rating
- [ ] User nhận notification khi admin reply
- [ ] Public endpoint chỉ hiển thị rating visible
- [ ] Admin endpoint có thể xem tất cả rating (kể cả hidden)
- [ ] Filter theo status hoạt động đúng

## Security Notes

1. **Authorization**: Chỉ admin mới có thể:
   - Reply đánh giá
   - Update/Delete reply
   - Thay đổi status rating

2. **Validation**:
   - Reply content: 1-2000 ký tự
   - Status: chỉ nhận "visible" hoặc "hidden"

3. **Data Privacy**:
   - Hidden rating vẫn tồn tại trong DB (soft hide)
   - Admin vẫn có thể xem và quản lý hidden rating

## Examples in Frontend

### Display Rating with Reply
```typescript
interface RatingDisplay {
  rating: number;
  comment: string;
  user: {
    fullname: string;
    avatar: string;
  };
  adminReply?: {
    content: string;
    admin: {
      fullname: string;
    };
    repliedAt: Date;
  };
}

// Component
<div className="rating-card">
  <div className="user-rating">
    <Rating value={rating.rating} />
    <p>{rating.comment}</p>
    <UserInfo user={rating.user} />
  </div>

  {rating.adminReply && (
    <div className="admin-reply">
      <Badge>Admin Reply</Badge>
      <p>{rating.adminReply.content}</p>
      <small>
        {rating.adminReply.admin.fullname} •
        {formatDate(rating.adminReply.repliedAt)}
      </small>
    </div>
  )}
</div>
```

## Error Handling

### Common Errors

```json
// Rating không tồn tại
{
  "success": false,
  "message": "Đánh giá không tồn tại"
}

// Rating chưa có reply
{
  "success": false,
  "message": "Rating này chưa có reply"
}

// Invalid status value
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    {
      "message": "Status phải là visible hoặc hidden"
    }
  ]
}
```
