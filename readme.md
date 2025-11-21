# Top Gear — Backend (API)

A friendly, plain-language guide to this project and how to run, test and deploy it.

This repository contains the backend API for an e-commerce application called "Top Gear". It provides endpoints for users, authentication, products, carts, orders, notifications and more. The API is written in TypeScript and uses Node.js, Express and MongoDB.

---

## Quick TL;DR (for non-technical readers)

- This code is the server that powers an online shop. The server stores products, user accounts, shopping carts, orders and sends notifications.
- Developers run the server locally (on their computer) to test features. In production the same server runs on a hosting service (e.g. Render).
- We use Docker to package the server so it runs the same way on any machine.

---

## Features (what this API provides)

- User management: sign up, sign in, user profile, avatars.
- Authentication: local login and social login support (Google/Facebook), password handling.
- Products & Variants: products, product variants, images, categories.
- Search: full-text search and autocomplete for products.
- Carts & Cart Details: store items users want to buy, update and remove items.
- Orders & Order Details: checkout process, order storage and management.
- Vouchers: apply discounts or voucher codes.
- Ratings & Comments: product reviews, comments and ratings.
- Notifications: system can store and deliver notifications (e.g. unread counts).
- Wishlist: users can save products for later.
- Admin / Dashboard endpoints for management views.
- Swagger API docs are included for developers (see `docs/` and the running server's swagger UI).

---

## High-level workflows (explained simply)

These explain how features behave from a user's perspective.

- Sign up / Login
  - A user provides an email/username and password (or uses social login). The server creates a user account and stores encrypted credentials.
  - On successful login the server returns a token (used by the frontend to prove who the user is on subsequent requests).

- Browsing & Search
  - Users search the store by typing keywords (e.g. "laptop"). The server uses a search index to find matching product names and returns results.
  - If product variant names are empty, the system can also fallback to searching the main product records and return matching variants.

- Cart & Checkout
  - Users add product variants to their cart. The server stores the cart items linked to the user.
  - At checkout the frontend sends the cart contents and payment information to the server, the server creates an order and returns confirmation.

- Orders & Notifications
  - Orders are stored with status (pending, paid, shipped, etc.). Notifications are created for events like new orders or status changes.
  - Users can read notifications and the server tracks unread counts.

- Wishlist & Ratings
  - Wishlist stores items user saved. Ratings and comments let users review products.

NOTE: These workflows are simplified — the real app includes error handling, validation, and various edge cases.

---

## Developer Setup (quick start)

We provide a Docker setup so you can run the full stack (API + MongoDB + Redis) locally. Using Docker ensures everyone runs the same environment.

Prerequisites
- Docker Desktop (running with WSL2 on Windows is recommended)
- Git

Steps (WSL recommended on Windows):

1. Open a terminal and go to the project root:

```bash
cd /mnt/d/xbox/DATN/top-gear-be
```

2. Copy the example environment file to `.env` and fill required values (do not commit your real secrets):

```bash
cp .env.example .env
# Edit .env with real credentials or for local dev use the compose DB
```

3. Run the full stack with Docker Compose (builds the backend and starts Mongo/Redis):

```bash
docker compose up --build
```

4. Open the API in your browser or use curl/Postman:

```bash
# Health endpoint
curl http://localhost:3000/api/v1/health

# Search example
curl "http://localhost:3000/api/v1/pvariants/search?q=laptop"
```

5. View logs:

```bash
docker compose logs -f backend
```

6. Stop the stack:

```bash
docker compose down
```

If you prefer to run without Docker you can install Node 18 (LTS), run `npm ci`, then `npm run build` and `npm run start` (the repo contains scripts). We recommend Docker for consistent results.

---

## Environment variables (.env)

Create a `.env` file (never commit it). Use `.env.example` as the template. Important keys:

- `MONGO_URI` — MongoDB connection string (use local docker host `mongodb://mongo:27017/topgeardb` when using docker-compose)
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` — Redis connection
- `JWT_SECRET` — secret for signing tokens
- `CORS_ORIGINS` — comma-separated list of allowed origins (frontend domains)

There is a committed `.env.example` file in the repository showing the required keys.

---

## API documentation

The project includes Swagger-compatible API docs in `docs/`. When the server is running locally, the built-in Swagger UI (configured in the app) lets developers explore endpoints and request/response formats.

---

## Deployment (Render)

This project supports deployment to Render (Docker). Suggested flow:

1. Connect your GitHub repo in the Render dashboard.
2. Create a new Web Service and choose **Docker** as the environment so Render uses the `Dockerfile` in the repo.
3. Add environment variables in the Render UI (MONGO_URI, REDIS_*, JWT_SECRET, CORS_ORIGINS, etc.).
4. Set Health Check Path to `/api/v1/health`.
5. Enable Auto Deploy (Render will build the Docker image on push to the selected branch).

Notes:
- Do not commit `.env` to your repository. Use Render's Environment Variables to store secrets.
- You can test builds locally using `docker compose build` before pushing.

---

## CI / CD recommendations (simple)

- Run automated tests and build in CI (e.g., GitHub Actions) on pull requests so broken code is not merged.
- Keep Render's auto-deploy enabled for the `main` branch, but protect `main` with branch protections that require CI to pass.

If you want a deploy pipeline that triggers only after CI passes, use a small GitHub Action that calls the Render deploy API (or pushes an image to GHCR then triggers a Render/host pull).

---

## Troubleshooting (common issues)

- `MODULE_NOT_FOUND` when starting in Docker: if a module is missing after building the container, check that `dependencies` in `package.json` include the package (not only `devDependencies`) and that `node_modules` from the build are preserved (use the named `node_modules` volume or do not mount host `node_modules`).
- `auth required` connecting to Mongo: verify `MONGO_URI` includes credentials or set `DB_USER`/`DB_PASSWORD` and ensure the build uses the correct value.
- CORS blocked in browser: check `CORS_ORIGINS` env and ensure the origin the browser sends (exact scheme+host+port) is included.

---

## For non-technical stakeholders — how the app works (very simply)

- The backend is a service that stores data (products, users, orders) and gives that data to the frontend when asked. It also accepts instructions (like "add this item to my cart"), stores them, and notifies users when something important happens.
- Developers update code in the Git repository. When code is pushed to the main branch and passes automated checks, the updated service is built and deployed to the cloud so users can use the new features.

---

## Where to look next (developer pointers)

- `src/api/*` — the API modules grouped by feature (users, products, carts, orders, notifications, etc.).
- `src/config` — configuration for database, Redis, Cloudinary, passport and other services.
- `src/middlewares` — error handling and auth middlewares.
- `docs/` — Swagger docs for the API definitions.

---

If you'd like, I can also generate:

- A smaller `README_FOR_NON_IT.md` that explains user workflows in even simpler terms.
- A `DEPLOY_RENDER.md` with step‑by‑step screenshots for setting environment variables in Render.
- A GitHub Actions CI workflow to run tests and optionally trigger Render deploy.

Tell me which of the above you'd like next and I'll add the file(s).
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
