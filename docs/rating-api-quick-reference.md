# Rating API - Quick Reference

## 🚀 Quick Start

```bash
BASE_URL=https://api.example.com/api/v1/rating
ADMIN_TOKEN=your_admin_jwt_token
```

---

## 📍 Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/laptop/:laptopId` | Public | Lấy ratings của laptop (chỉ visible) |
| `GET` | `/admin/all` | Admin | Lấy tất cả ratings với filters |
| `POST` | `/admin/:id/reply` | Admin | Thêm reply cho rating |
| `PATCH` | `/admin/:id/reply` | Admin | Cập nhật reply |
| `DELETE` | `/admin/:id/reply` | Admin | Xóa reply |
| `PATCH` | `/admin/:id/status` | Admin | Cập nhật status (visible/hidden) |

---

## 📝 Request/Response Examples

### 1. Get Visible Ratings (Public)

```bash
GET /rating/laptop/673f2a8b9c8d5e1234567890?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ratings": [
      {
        "_id": "673f...",
        "rating": 5,
        "comment": "Tuyệt vời!",
        "status": "visible",
        "adminReply": {
          "content": "Cảm ơn bạn!",
          "adminId": { "_id": "...", "fullname": "Admin" },
          "repliedAt": "2025-11-26T10:00:00.000Z"
        }
      }
    ],
    "total": 50,
    "page": 1,
    "totalPages": 5
  }
}
```

---

### 2. Get All Ratings (Admin)

```bash
GET /rating/admin/all?status=visible&rating=5&page=1

Headers:
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:** Same as above

---

### 3. Add Reply

```bash
POST /rating/admin/673f.../reply

Headers:
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

Body:
{
  "content": "Cảm ơn bạn đã đánh giá!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "673f...",
    "rating": 5,
    "adminReply": {
      "content": "Cảm ơn bạn đã đánh giá!",
      "adminId": {
        "_id": "admin123",
        "fullname": "Admin Name"
      },
      "repliedAt": "2025-11-26T10:00:00.000Z"
    }
  },
  "message": "Trả lời đánh giá thành công"
}
```

---

### 4. Update Reply

```bash
PATCH /rating/admin/673f.../reply

Headers:
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

Body:
{
  "content": "Updated reply content"
}
```

---

### 5. Delete Reply

```bash
DELETE /rating/admin/673f.../reply

Headers:
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": { /* rating without adminReply */ },
  "message": "Xóa trả lời thành công"
}
```

---

### 6. Hide Rating

```bash
PATCH /rating/admin/673f.../status

Headers:
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

Body:
{
  "status": "hidden"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "673f...",
    "status": "hidden",
    /* other fields */
  },
  "message": "Cập nhật trạng thái thành công"
}
```

---

### 7. Show Rating

```bash
PATCH /rating/admin/673f.../status

Body:
{
  "status": "visible"
}
```

---

## 🔍 Filter Options (Admin)

```bash
GET /rating/admin/all?[filters]
```

| Parameter | Type | Values | Description |
|-----------|------|--------|-------------|
| `status` | string | `visible`, `hidden` | Lọc theo trạng thái |
| `rating` | number | `1-5` | Lọc theo số sao |
| `laptopId` | string | ObjectId | Lọc theo laptop |
| `userId` | string | ObjectId | Lọc theo user |
| `orderId` | string | ObjectId | Lọc theo order |
| `search` | string | any | Tìm kiếm trong comment |
| `page` | number | 1+ | Số trang |
| `limit` | number | 1-100 | Số items/page |

**Examples:**
```bash
# Lấy tất cả rating 1 sao đã ẩn
GET /rating/admin/all?rating=1&status=hidden

# Lấy rating visible của laptop cụ thể
GET /rating/admin/all?laptopId=673f...&status=visible

# Tìm kiếm trong comment
GET /rating/admin/all?search=tuyệt vời
```

---

## ⚠️ Common Errors

### 400 Bad Request
```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    {
      "message": "Nội dung reply không được để trống"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Đánh giá không tồn tại"
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden"
}
```

---

## 🎯 Common Workflows

### Workflow 1: Admin Reply to Positive Review

```bash
# Step 1: Get visible 5-star ratings
GET /rating/admin/all?rating=5&status=visible

# Step 2: Reply to a rating
POST /rating/admin/673f.../reply
Body: { "content": "Cảm ơn bạn! 🎉" }
```

---

### Workflow 2: Handle Negative Review

```bash
# Step 1: Get 1-star ratings
GET /rating/admin/all?rating=1

# Step 2: Reply to apologize
POST /rating/admin/673f.../reply
Body: { "content": "Xin lỗi vì trải nghiệm không tốt..." }

# Step 3: If inappropriate, hide it
PATCH /rating/admin/673f.../status
Body: { "status": "hidden" }
```

---

### Workflow 3: Manage Reply

```bash
# Step 1: Edit existing reply
PATCH /rating/admin/673f.../reply
Body: { "content": "Updated content" }

# Step 2: Or delete if needed
DELETE /rating/admin/673f.../reply
```

---

## 📊 Response Data Structure

```typescript
interface IRating {
  _id: string;
  orderId: string;
  userId: {
    _id: string;
    fullname: string;
    email: string;
    avatar?: string;
  };
  laptopId?: {
    _id: string;
    name: string;
    modelName: string;
    images: string[];
  } | null;
  rating: number; // 1-5
  comment?: string;
  status: 'visible' | 'hidden';
  adminReply?: {
    content: string;
    adminId: {
      _id: string;
      fullname: string;
      email: string;
    };
    repliedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

---

## ✅ Validation Rules

| Field | Type | Min | Max | Required |
|-------|------|-----|-----|----------|
| `content` (reply) | string | 1 | 2000 | Yes |
| `status` | enum | - | - | Yes |
| `status` values | - | - | - | `visible`, `hidden` |

---

## 🔐 Authorization

All admin endpoints require:
```
Authorization: Bearer <admin_jwt_token>
```

User must have role: `admin` or `manager`

---

## 💡 Tips

1. **Reply Content**:
   - Min: 1 char
   - Max: 2000 chars
   - Hỗ trợ Unicode (tiếng Việt, emoji)

2. **Status Update**:
   - Không xóa rating, chỉ ẩn/hiện
   - Admin vẫn thấy hidden ratings
   - Public chỉ thấy visible ratings

3. **Filters**:
   - Có thể combine nhiều filters
   - Pagination always recommended
   - Default: page=1, limit=20

4. **Notifications**:
   - User tự động nhận thông báo khi admin reply
   - Không cần gọi API notification riêng

---

## 🧪 Test with cURL

```bash
# Set variables
ADMIN_TOKEN="your_token_here"
RATING_ID="673f2a8b9c8d5e1234567890"
API_URL="http://localhost:3000/api/v1/rating"

# Add reply
curl -X POST "$API_URL/admin/$RATING_ID/reply" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Cảm ơn bạn!"}'

# Hide rating
curl -X PATCH "$API_URL/admin/$RATING_ID/status" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"hidden"}'
```

---

## 📱 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no token/invalid token) |
| 403 | Forbidden (not admin) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

**Last Updated:** 2025-11-26
**Version:** 1.0
