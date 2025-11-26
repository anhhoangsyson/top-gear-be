# 📚 Rating System Documentation

Tổng hợp tài liệu về hệ thống Rating với các tính năng Admin Reply và Status Management.

---

## 📖 Danh sách tài liệu

### 1. 🎯 **[rating-frontend-implementation.md](./rating-frontend-implementation.md)**
**Dành cho: Frontend Developers**

Hướng dẫn chi tiết về cách implement các tính năng rating cho Frontend:
- TypeScript interfaces đầy đủ
- API endpoints và cách sử dụng
- React components mẫu (RatingCard, AdminRatingCard, FilterComponent)
- Custom hooks (useRatingManagement)
- Complete page examples
- Error handling
- Performance optimization tips

**Thời gian đọc:** ~30 phút

---

### 2. ⚡ **[rating-api-quick-reference.md](./rating-api-quick-reference.md)**
**Dành cho: Tất cả developers**

Tài liệu tham khảo nhanh về API:
- Tất cả endpoints với examples
- Request/Response format
- Query parameters
- Common workflows
- cURL examples
- Error codes

**Thời gian đọc:** ~10 phút

---

### 3. 🔧 **[rating-reply-and-status.md](./rating-reply-and-status.md)**
**Dành cho: Backend Developers, System Architects**

Tài liệu kỹ thuật chi tiết:
- Schema changes
- Database migration notes
- Architecture decisions
- Security considerations
- Use cases
- Testing checklist

**Thời gian đọc:** ~20 phút

---

### 4. 🧪 **[rating-api-test.http](./rating-api-test.http)**
**Dành cho: QA, Backend Developers**

File test APIs sử dụng REST Client (VSCode extension):
- Test cases cho tất cả endpoints
- Error cases testing
- Complete workflow testing
- Stress testing scenarios

**Cách sử dụng:**
1. Install REST Client extension trong VSCode
2. Cập nhật `@adminToken` và `@ratingId`
3. Click "Send Request" để test

---

### 5. 📋 **[CHANGELOG-rating.md](./CHANGELOG-rating.md)**
**Dành cho: Tất cả team members**

Lịch sử thay đổi của Rating System:
- Version 2.0.0 changes
- New features detail
- Breaking changes (none)
- Deployment notes
- Future enhancements

**Thời gian đọc:** ~15 phút

---

### 6. 👨‍💼 **[rating.admin.md](./rating.admin.md)**
**Dành cho: Admin Users, Backend Developers**

Tài liệu về các API dành cho admin:
- Quản lý ratings
- Filtering & sorting
- Statistics endpoints
- Bulk operations

**Note:** Tài liệu này đã tồn tại trước, được bổ sung thêm tính năng mới.

---

## 🚀 Quick Start Guide

### Cho Frontend Developer

1. **Đọc trước:**
   - [rating-api-quick-reference.md](./rating-api-quick-reference.md) - Hiểu API
   - [rating-frontend-implementation.md](./rating-frontend-implementation.md) - Xem examples

2. **Implement:**
   - Copy TypeScript interfaces
   - Copy React components
   - Customize theo design của bạn

3. **Test:**
   - Use test file để verify API
   - Test với data thực tế

### Cho Backend Developer

1. **Đọc trước:**
   - [rating-reply-and-status.md](./rating-reply-and-status.md) - Hiểu architecture
   - [CHANGELOG-rating.md](./CHANGELOG-rating.md) - Biết thay đổi gì

2. **Code review:**
   - Check các files đã modify
   - Review validation logic
   - Check error handling

3. **Test:**
   - Run test file [rating-api-test.http](./rating-api-test.http)
   - Test edge cases

### Cho QA/Tester

1. **Test manual:**
   - Use [rating-api-test.http](./rating-api-test.http)
   - Follow test cases trong docs

2. **Test checklist:**
   - User features
   - Admin features
   - Edge cases
   - Performance

---

## 🎯 Features Overview

### ✨ Admin Reply (NEW)
Admin có thể trả lời đánh giá của khách hàng.

**Benefits:**
- Tăng tương tác với khách hàng
- Giải đáp thắc mắc
- Cải thiện customer satisfaction
- Tạo niềm tin với khách hàng mới

**Workflows:**
```
1. Customer posts rating (1-5 stars + comment)
2. Admin receives notification
3. Admin replies to rating
4. Customer receives notification
5. Reply visible to all users
```

---

### 🔒 Status Management (NEW)
Admin có thể ẩn/hiện ratings không phù hợp.

**Benefits:**
- Kiểm soát nội dung hiển thị
- Xử lý spam/abuse
- Bảo vệ thương hiệu
- Tuân thủ quy định

**Status Types:**
- `visible` - Hiển thị công khai
- `hidden` - Ẩn khỏi public, admin vẫn thấy

---

## 📊 API Endpoints Summary

| Feature | Method | Endpoint | Auth |
|---------|--------|----------|------|
| Get ratings (public) | GET | `/laptop/:laptopId` | No |
| Get all ratings | GET | `/admin/all` | Admin |
| Add reply | POST | `/admin/:id/reply` | Admin |
| Update reply | PATCH | `/admin/:id/reply` | Admin |
| Delete reply | DELETE | `/admin/:id/reply` | Admin |
| Update status | PATCH | `/admin/:id/status` | Admin |

---

## 🗂️ Code Structure

```
src/api/rating/
├── schema/
│   └── rating.schema.ts          # ✅ Updated - Added status, adminReply
├── dto/
│   └── rating.dto.ts              # ✅ Updated - Added reply & status DTOs
├── repository/
│   └── rating.repository.ts       # ✅ Updated - Added new methods
├── service/
│   └── rating.service.ts          # ✅ Updated - Added business logic
├── controller/
│   └── rating.controller.ts       # ✅ Updated - Added new controllers
└── router/
    └── rating.router.ts           # ✅ Updated - Added new routes

docs/
├── rating-frontend-implementation.md    # Frontend guide
├── rating-api-quick-reference.md        # API reference
├── rating-reply-and-status.md           # Technical docs
├── rating-api-test.http                 # Test file
├── CHANGELOG-rating.md                  # Change log
└── README-rating-system.md              # This file
```

---

## 🔐 Authentication & Authorization

### Public Endpoints
```javascript
// No authentication required
GET /api/v1/rating/laptop/:laptopId
GET /api/v1/rating/:id
```

### User Endpoints
```javascript
// Requires JWT token
Authorization: Bearer <user_token>

POST /api/v1/rating
PATCH /api/v1/rating/:id
DELETE /api/v1/rating/:id
```

### Admin Endpoints
```javascript
// Requires JWT token + admin role
Authorization: Bearer <admin_token>

GET /api/v1/rating/admin/all
POST /api/v1/rating/admin/:id/reply
PATCH /api/v1/rating/admin/:id/reply
DELETE /api/v1/rating/admin/:id/reply
PATCH /api/v1/rating/admin/:id/status
```

---

## 💾 Database Schema

```javascript
{
  _id: ObjectId,
  orderId: ObjectId,           // ref: Order
  userId: ObjectId,            // ref: users
  laptopId: ObjectId | null,   // ref: Laptop
  rating: Number,              // 1-5
  comment: String,             // max 1000 chars

  // NEW FIELDS
  status: String,              // enum: ['visible', 'hidden']
  adminReply: {                // optional
    content: String,           // 1-2000 chars
    adminId: ObjectId,         // ref: users
    repliedAt: Date
  },

  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ orderId: 1, userId: 1, laptopId: 1 }` - unique
- `{ status: 1 }` - NEW

---

## 🧪 Testing

### Manual Testing

**Tools:**
- REST Client (VSCode extension)
- Postman
- cURL

**Test File:**
[rating-api-test.http](./rating-api-test.http)

### Test Checklist

**User Features:**
- [ ] View ratings with admin replies
- [ ] Only see visible ratings
- [ ] Receive notification when admin replies

**Admin Features:**
- [ ] Reply to rating
- [ ] Edit reply
- [ ] Delete reply
- [ ] Hide rating
- [ ] Show rating
- [ ] Filter by status
- [ ] View all ratings (including hidden)

**Edge Cases:**
- [ ] Reply with 1 character
- [ ] Reply with 2000 characters
- [ ] Reply with 2001 characters (should fail)
- [ ] Invalid status value (should fail)
- [ ] Update non-existent reply (should fail)
- [ ] Delete non-existent reply (should fail)

---

## 🐛 Common Issues & Solutions

### Issue 1: "Đánh giá không tồn tại"
**Cause:** Invalid rating ID
**Solution:** Check rating ID format (must be valid ObjectId)

### Issue 2: "Rating này chưa có reply"
**Cause:** Trying to update/delete non-existent reply
**Solution:** Check if `adminReply` exists before update/delete

### Issue 3: 401 Unauthorized
**Cause:** Missing or invalid token
**Solution:** Check Authorization header format: `Bearer <token>`

### Issue 4: 403 Forbidden
**Cause:** User is not admin
**Solution:** Ensure user has admin role in database

### Issue 5: Validation error
**Cause:** Invalid input data
**Solution:** Check validation rules in DTOs

---

## 📈 Performance Considerations

### Query Optimization
```javascript
// ✅ Good - Use index
Rating.find({ status: 'visible' })

// ✅ Good - Populate only needed fields
.populate('adminReply.adminId', 'fullname email')

// ❌ Bad - Populate all fields
.populate('adminReply.adminId')
```

### Pagination
```javascript
// Always use pagination for lists
const limit = 20; // Max 100
const skip = (page - 1) * limit;

Rating.find().skip(skip).limit(limit)
```

### Caching Strategies
```javascript
// Cache public ratings list
// TTL: 5 minutes
// Invalidate on: new rating, status change, reply added
```

---

## 🔄 Migration & Deployment

### Database Migration
**Not required** - Schema has default values.

Existing ratings automatically have:
- `status: "visible"`
- `adminReply: undefined`

### Deployment Steps

1. **Backup database**
   ```bash
   mongodump --uri="mongodb://..." --out=/backup
   ```

2. **Pull latest code**
   ```bash
   git pull origin master
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Build**
   ```bash
   npm run build
   ```

5. **Restart server**
   ```bash
   pm2 restart all
   ```

6. **Verify**
   - Check API endpoints
   - Test admin reply
   - Test status management

### Rollback Plan
```bash
# If issues occur
git revert <commit-hash>
npm install
npm run build
pm2 restart all

# Restore database if needed
mongorestore /backup
```

---

## 🎓 Training Materials

### For Admin Users
- [ ] Create admin user guide (TODO)
- [ ] Create video tutorial (TODO)
- [ ] Conduct training session (TODO)

### For Developers
- [x] Technical documentation
- [x] Code examples
- [x] API reference
- [ ] Video walkthrough (TODO)

---

## 🔮 Future Enhancements

### Version 2.1.0 (Planned)
- Bulk operations
- Reply templates
- Analytics dashboard
- Email notifications

### Version 2.2.0 (Under consideration)
- Rating appeal system
- Multiple admin replies
- Reply reactions
- Audit log

See [CHANGELOG-rating.md](./CHANGELOG-rating.md) for details.

---

## 📞 Support & Contact

### Questions?
- **Technical:** Slack #rating-system
- **Business:** PM team
- **Bugs:** Create Jira ticket

### Documentation Issues
If you find any issues in this documentation:
1. Create issue in Jira
2. Tag: `documentation`
3. Component: `rating-system`

---

## 📚 Additional Resources

### Internal
- API Documentation (Swagger)
- Database Schema Diagram
- Architecture Decision Records (ADR)

### External
- [Mongoose Documentation](https://mongoosejs.com/)
- [Zod Validation](https://zod.dev/)
- [Express.js Guide](https://expressjs.com/)

---

## ✅ Document Status

| Document | Status | Last Updated | Author |
|----------|--------|--------------|--------|
| Frontend Implementation | ✅ Complete | 2025-11-26 | Backend Team |
| API Quick Reference | ✅ Complete | 2025-11-26 | Backend Team |
| Technical Docs | ✅ Complete | 2025-11-26 | Backend Team |
| Test File | ✅ Complete | 2025-11-26 | Backend Team |
| Changelog | ✅ Complete | 2025-11-26 | Backend Team |
| This README | ✅ Complete | 2025-11-26 | Backend Team |

---

**Version:** 2.0.0
**Last Updated:** 2025-11-26
**Maintained by:** Backend Team

---

## 🙏 Contributors

Thank you to everyone who contributed to this release:
- Backend Team Lead - Implementation
- Code Reviewers - Review & Testing
- PM - Requirements & Acceptance
- QA Team - Testing

---

**Happy Coding! 🚀**
