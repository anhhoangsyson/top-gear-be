# 🚀 Top Gear - E-Commerce Backend API

> Backend API cho hệ thống bán laptop Top Gear, xây dựng với Node.js, Express, TypeScript và MongoDB.

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
- [Cài đặt](#-cài-đặt)
- [Cấu hình](#️-cấu-hình)
- [Chạy dự án](#-chạy-dự-án)
- [API Documentation](#-api-documentation)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Scripts](#-scripts)
- [Tính năng chi tiết](#-tính-năng-chi-tiết)

---

## ✨ Tính năng

### 🔐 Authentication & Authorization
- ✅ Đăng ký, đăng nhập với email/password
- ✅ Đăng nhập với Facebook OAuth
- ✅ JWT authentication với refresh token
- ✅ Role-based access control (Admin, User)
- ✅ Session management với Redis

### 👤 User Management
- ✅ Quản lý thông tin user
- ✅ Upload avatar (Cloudinary)
- ✅ Update profile
- ✅ Password reset/change

### 🛍️ Product Management
- ✅ CRUD sản phẩm laptop
- ✅ Product variants (màu sắc, cấu hình)
- ✅ Product attributes (CPU, RAM, Storage, etc.)
- ✅ Product images (multiple images)
- ✅ Categories & Brands
- ✅ Product groups
- ✅ Stock management

### 🛒 Shopping Cart
- ✅ Add/Remove items
- ✅ Update quantity
- ✅ Cart details với product info

### 📦 Order Management
- ✅ Create order
- ✅ Order tracking
- ✅ Order status management
- ✅ Order history
- ✅ Cancel order
- ✅ Admin order management

### 💳 Payment Integration
- ✅ Cash on Delivery (COD)
- ✅ ZaloPay integration
- ✅ Stripe integration
- ✅ Payment callback handling

### 🎫 Voucher System
- ✅ Create/manage vouchers
- ✅ Apply discount codes
- ✅ Voucher validation
- ✅ Usage tracking

### 💬 Social Features
- ✅ Blog posts
- ✅ Comments system
- ✅ Like/Unlike posts
- ✅ User interactions

### 🔔 Real-time Notifications
- ✅ Socket.io realtime notifications
- ✅ Order notifications (customer + admin)
- ✅ Comment notifications
- ✅ Like notifications
- ✅ Promotion notifications
- ✅ Unread count tracking
- ✅ Mark as read/unread
- ✅ Notification history

### 📊 Admin Dashboard
- ✅ Dashboard statistics
- ✅ Revenue reports
- ✅ Order analytics
- ✅ User management
- ✅ Product management

### 📍 Location Services
- ✅ Provinces/Cities
- ✅ Districts
- ✅ Wards
- ✅ Address management

### 📧 Email Services
- ✅ SendGrid integration
- ✅ Email templates (EJS)
- ✅ Order confirmation emails
- ✅ Welcome emails

---

## 🛠️ Công nghệ sử dụng

### Core
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### Authentication & Security
- **Passport** - Authentication middleware
- **JWT** - JSON Web Tokens
- **bcryptjs** - Password hashing
- **crypto-js** - Encryption

### Real-time & Caching
- **Socket.io** - Real-time bidirectional communication
- **Redis** (ioredis) - Caching & session store

### File Upload
- **Multer** - File upload middleware
- **Cloudinary** - Image hosting & management

### Payment
- **Stripe** - Payment processing
- **ZaloPay** - Vietnamese payment gateway

### Email
- **SendGrid** - Email delivery
- **EJS** - Email templates

### Validation
- **Zod** - Schema validation
- **Joi** - Data validation
- **express-validator** - Request validation

### Documentation
- **Swagger** (swagger-jsdoc) - API documentation

### Development Tools
- **Nodemon** - Auto-restart server
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Jest** - Testing framework

---

## 📦 Cài đặt

### Yêu cầu hệ thống

- Node.js >= 18.x
- MongoDB >= 6.x
- Redis >= 7.x
- npm hoặc yarn

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd top-gear-be
```

### Bước 2: Install dependencies

```bash
npm install
# hoặc
yarn install
```

---

## ⚙️ Cấu hình

### Tạo file `.env` trong thư mục root:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_REFESH_SECREt=your-jwt-refresh-secret-key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@topgear.com

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/v1/auth/facebook/callback

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key

# ZaloPay
ZALOPAY_APP_ID=your-zalopay-app-id
ZALOPAY_KEY1=your-zalopay-key1
ZALOPAY_KEY2=your-zalopay-key2
ZALOPAY_ENDPOINT=https://sb-openapi.zalopay.vn/v2/create

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

---

## 🚀 Chạy dự án

### Development mode

```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

### Production mode

```bash
npm run build
npm start
```

### Other commands

```bash
# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm run test
```

---

## 📚 API Documentation

### Swagger UI

Sau khi start server, mở browser:

```
http://localhost:3000/api-docs
```

### API Base URL

```
http://localhost:3000/api/v1
```

### Main Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/login` - Đăng nhập
- `GET /api/v1/auth/me` - Lấy thông tin user
- `PUT /api/v1/auth/me/edit` - Cập nhật profile

#### Products
- `GET /api/v1/products` - Lấy danh sách sản phẩm
- `GET /api/v1/products/:id` - Chi tiết sản phẩm
- `POST /api/v1/products` - Tạo sản phẩm (Admin)
- `PUT /api/v1/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/v1/products/:id` - Xóa sản phẩm (Admin)

#### Orders
- `POST /api/v1/order` - Tạo đơn hàng
- `GET /api/v1/order` - Lấy danh sách đơn hàng
- `GET /api/v1/order/:id` - Chi tiết đơn hàng
- `PATCH /api/v1/order/:id/status` - Cập nhật trạng thái (Admin)

#### Cart
- `GET /api/v1/carts` - Lấy giỏ hàng
- `POST /api/v1/carts` - Thêm vào giỏ
- `PUT /api/v1/carts/:id` - Cập nhật giỏ hàng
- `DELETE /api/v1/carts/:id` - Xóa khỏi giỏ

#### Notifications
- `GET /api/v1/notifications` - Lấy danh sách thông báo
- `GET /api/v1/notifications/unread-count` - Đếm chưa đọc
- `PATCH /api/v1/notifications/:id/read` - Đánh dấu đã đọc
- `PATCH /api/v1/notifications/mark-all-read` - Đánh dấu tất cả
- `DELETE /api/v1/notifications/:id` - Xóa thông báo

#### Vouchers
- `GET /api/v1/voucher` - Lấy danh sách voucher
- `POST /api/v1/voucher` - Tạo voucher (Admin)
- `GET /api/v1/voucher/:id` - Chi tiết voucher

#### Blog
- `GET /api/v1/blog` - Lấy danh sách blog
- `POST /api/v1/blog` - Tạo blog post
- `GET /api/v1/blog/:id` - Chi tiết blog

#### Comments
- `GET /api/v1/comments` - Lấy comments
- `POST /api/v1/comments` - Tạo comment
- `DELETE /api/v1/comments/:id` - Xóa comment

#### Admin Dashboard
- `GET /api/v1/admin/dashboard` - Dashboard statistics

---

## 📁 Cấu trúc thư mục

```
top-gear-be/
├── docs/                      # Swagger documentation files
├── src/
│   ├── api/                   # API modules
│   │   ├── auth/             # Authentication
│   │   ├── users/            # User management
│   │   ├── product/          # Products
│   │   ├── order/            # Orders
│   │   ├── carts/            # Shopping cart
│   │   ├── notification/     # Notifications (NEW)
│   │   ├── voucher/          # Vouchers
│   │   ├── blog/             # Blog posts
│   │   ├── comments/         # Comments
│   │   ├── like/             # Likes
│   │   ├── category/         # Categories
│   │   ├── brand/            # Brands
│   │   ├── laptop/           # Laptop products
│   │   ├── location/         # Location services
│   │   └── dashboard/        # Admin dashboard
│   │
│   ├── config/               # Configuration files
│   │   ├── database/         # MongoDB config
│   │   ├── redis/            # Redis config
│   │   ├── passport/         # Passport strategies
│   │   ├── cloudinary/       # Cloudinary config
│   │   ├── stripe/           # Stripe config
│   │   ├── zalopay/          # ZaloPay config
│   │   ├── email/            # Email config
│   │   └── swagger/          # Swagger config
│   │
│   ├── middlewares/          # Express middlewares
│   │   ├── authenticate/     # Authentication middleware
│   │   ├── notification/     # Notification helpers (NEW)
│   │   ├── validations/      # Validation middleware
│   │   ├── upload/           # Upload middleware
│   │   └── errorHandle.ts    # Error handler
│   │
│   ├── services/             # Business logic services
│   │   ├── socket/           # Socket.io service (NEW)
│   │   └── cloudinary/       # Image upload service
│   │
│   ├── types/                # TypeScript types
│   │   └── notification.types.ts  # Notification types (NEW)
│   │
│   ├── constants/            # Constants & enums
│   ├── validations/          # Validation schemas
│   ├── views/                # Email templates (EJS)
│   └── index.ts             # Application entry point
│
├── test/                     # Test files
├── .env                      # Environment variables
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── jest.config.ts           # Jest config
├── eslint.config.js         # ESLint config
└── README.md               # This file
```

### Module Structure (Example: Notification)

```
api/notification/
├── controller/              # Request handlers
│   └── notification.controller.ts
├── service/                # Business logic
│   └── notification.service.ts
├── repository/             # Database operations
│   └── notification.repository.ts
├── schema/                 # Mongoose schemas
│   └── notification.schema.ts
├── dto/                    # Data Transfer Objects
│   └── notification.dto.ts
└── router/                 # Route definitions
    └── notification.router.ts
```

---

## 📜 Scripts

```json
{
  "dev": "nodemon src/index.ts",        // Development mode với auto-reload
  "build": "tsc",                       // Build TypeScript
  "format": "prettier --write 'src/**/*.{js,ts,json,md}'",  // Format code
  "lint": "eslint --fix src/index.ts",  // Lint & fix code
  "test": "jest",                       // Run tests
  "prepare": "husky"                    // Setup git hooks
}
```

---

## 🔥 Tính năng chi tiết

### 1. 🔔 Real-time Notification System

**WebSocket với Socket.io:**
- Kết nối realtime giữa client và server
- Authentication với JWT token
- Room-based notification delivery
- Support multiple devices cùng user

**Loại notifications:**
- 📦 Order notifications (tạo đơn, cập nhật trạng thái)
- 💬 Comment notifications
- ❤️ Like notifications
- 🎁 Promotion notifications
- 🔔 System notifications
- 📦 Product notifications

**Features:**
- Pagination & filtering
- Mark as read/unread
- Unread count
- Delete notifications
- Bulk operations
- Admin notifications

**Socket Events:**
- `authenticate` - Xác thực user
- `new_notification` - Nhận notification mới
- `notification_read` - Notification đã đọc
- `ping/pong` - Health check

### 2. 💳 Payment Integration

**ZaloPay:**
- Tạo order ZaloPay
- Payment callback handling
- Order status update
- Refund support

**Stripe:**
- Card payment processing
- Webhook handling
- Payment confirmation

**Cash on Delivery:**
- COD support
- Manual payment confirmation

### 3. 🖼️ Image Management

**Cloudinary Integration:**
- Multi-image upload
- Image optimization
- Cloud storage
- CDN delivery
- Image transformation

### 4. 📧 Email System

**SendGrid Integration:**
- Transactional emails
- Email templates với EJS
- Order confirmation
- Welcome emails
- Password reset

### 5. 🔐 Security

**Authentication:**
- JWT with refresh token
- Password hashing (bcryptjs)
- Session management (Redis)
- OAuth (Facebook)

**Authorization:**
- Role-based access control
- Protected routes
- Admin-only endpoints

**Data Validation:**
- Zod schema validation
- Request validation
- Input sanitization

### 6. 📊 Caching & Performance

**Redis:**
- Session storage
- Token storage
- Cache frequently accessed data
- Rate limiting (optional)

**Database:**
- MongoDB indexing
- Query optimization
- Lean queries
- Pagination

---

## 🧪 Testing

### Run tests

```bash
npm run test
```

### Test structure

```
test/
└── example.test.ts
```

### Write tests

```typescript
describe('Feature', () => {
  it('should work correctly', () => {
    expect(true).toBe(true);
  });
});
```

---

## 🐛 Troubleshooting

### MongoDB connection error
```bash
# Check MongoDB URI in .env
# Verify network access in MongoDB Atlas
# Check firewall settings
```

### Redis connection error
```bash
# Start Redis server
redis-server

# Or install Redis
# Windows: https://github.com/microsoftarchive/redis/releases
# Mac: brew install redis
# Linux: sudo apt-get install redis-server
```

### Port already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Code Style

### ESLint + Prettier

Code được auto-format khi commit (Husky + lint-staged)

```bash
# Manual format
npm run format

# Manual lint
npm run lint
```

---

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

## 👥 Team

- **Backend Developer** - [Your Name]
- **Frontend Developer** - [Frontend Team]

---

## 📞 Support

Nếu có vấn đề, tạo issue tại [GitHub Issues](repository-url/issues)

---

## 🚧 Roadmap

### Completed ✅
- [x] Authentication & Authorization
- [x] Product Management
- [x] Order Management
- [x] Payment Integration
- [x] Real-time Notifications
- [x] Email System
- [x] Admin Dashboard

### In Progress 🚧
- [ ] Advanced Analytics
- [ ] Inventory Management
- [ ] Shipping Integration
- [ ] Review & Rating System

### Planned 📅
- [ ] Push Notifications (FCM)
- [ ] SMS Notifications
- [ ] Multi-language Support
- [ ] Advanced Search (Elasticsearch)
- [ ] Recommendation Engine

---

## 🎯 Quick Start

```bash
# 1. Clone & Install
git clone <repo-url>
cd top-gear-be
npm install

# 2. Configure
cp .env.example .env
# Edit .env với thông tin của bạn

# 3. Run
npm run dev

# 4. Test
curl http://localhost:3000/
# Response: "taideptrai1901" = Success! ✅

# 5. Open Swagger
http://localhost:3000/api-docs
```

---

## 🌟 Features Highlights

- 🚀 **High Performance** - Optimized queries, caching với Redis
- 🔒 **Secure** - JWT, bcrypt, validation, sanitization
- 📱 **Real-time** - Socket.io notifications
- 💳 **Payment Ready** - ZaloPay, Stripe integration
- 📧 **Email Ready** - SendGrid templates
- 📊 **Admin Dashboard** - Statistics & analytics
- 🖼️ **Image Hosting** - Cloudinary CDN
- 📚 **Well Documented** - Swagger API docs
- ✅ **Type Safe** - Full TypeScript
- 🧪 **Testable** - Jest testing setup

---

**Made with ❤️ by Top Gear Team**
