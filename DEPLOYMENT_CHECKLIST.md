# 🚀 Backend Deployment Checklist

## ✅ Checklist Trước Khi Deploy

### 1. **Environment Variables (.env)**

#### ❌ **QUAN TRỌNG: KHÔNG commit .env file lên Git!**

Kiểm tra `.gitignore` đã có `.env`:
```bash
cat .gitignore | grep .env
```

#### Các biến môi trường cần thiết:

**MongoDB:**
```env
MONGO_URI=mongodb://...
DB_USER=your_user
DB_PASSWORD=your_password
```
- ✅ Đã có
- ⚠️ **LƯU Ý:** Khi deploy production, thay bằng MongoDB production URL

**Redis:**
```env
REDIS_HOST=your-redis-host
REDIS_PORT=13391
REDIS_PASSWORD=your-password
```
- ✅ Đã có
- ⚠️ **LƯU Ý:** Verify Redis cloud có support region deployment của bạn

**Cloudinary:**
```env
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```
- ✅ Đã có

**JWT Tokens:**
```env
JWT_SECRET=your_jwt_secret
JWT_REFESH_SECREt=your_refresh_secret
```
- ✅ Đã có
- ⚠️ **BẢO MẬT:** Đảm bảo secrets đủ mạnh cho production

**ZaloPay:**
```env
APP_ID=2554
ZALOPAY_KEY1=...
ZALOPAY_KEY2=...
ZALOPAY_URL_ENDPOINT=https://sb-openapi.zalopay.vn/v2/create
```
- ✅ Đã có
- ⚠️ **QUAN TRỌNG:** Đây là sandbox endpoint. Khi lên production cần đổi sang production endpoint!

**Stripe:**
```env
STRIPE_SECRET=sk_test_...
```
- ✅ Đã có
- ⚠️ **QUAN TRỌNG:** Đây là test key. Production cần dùng `sk_live_...`

**SendGrid (Email):**
```env
SENDGRID_API_KEY=''
SENDGRID_FROM=''
```
- ❌ **CHƯA CẤU HÌNH** - Nếu không dùng email thì OK

---

### 2. **Callback URLs - QUAN TRỌNG!**

#### 🔴 **ZaloPay Callback URL hiện tại:**

**File:** `src/api/order/service/payment.service.ts:48-49`

```typescript
callback_url: 'https://top-gear-be.vercel.app/api/v1/order/callback'
```

#### ⚠️ **CẦN KIỂM TRA:**

1. **Domain chính xác chưa?**
   - Nếu deploy lên Vercel → OK
   - Nếu deploy lên VPS/Railway/Render → Phải đổi URL

2. **Đăng ký callback URL với ZaloPay:**
   - Vào dashboard ZaloPay
   - Đăng ký callback URL: `https://your-domain.com/api/v1/order/callback`
   - ⚠️ **QUAN TRỌNG:** ZaloPay chỉ gọi callback đến URL đã đăng ký!

3. **Test callback URL:**
```bash
# Test endpoint hoạt động
curl -X POST https://your-domain.com/api/v1/order/callback \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

#### **Nếu deploy lên platform khác:**

**Vercel:** ✅ Đã có `https://top-gear-be.vercel.app`

**Railway:**
```typescript
callback_url: 'https://your-app.railway.app/api/v1/order/callback'
```

**Render:**
```typescript
callback_url: 'https://your-app.onrender.com/api/v1/order/callback'
```

**VPS (custom domain):**
```typescript
callback_url: 'https://api.yourdomain.com/api/v1/order/callback'
```

#### **Local Development:**
```typescript
// Uncomment line 48, comment line 49
callback_url: 'https://your-ngrok-url.ngrok-free.app/api/v1/order/callback'
```

---

### 3. **Cấu hình Production vs Development**

#### **Tạo file `.env.production`:**

```env
# Production MongoDB (Atlas)
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/production-db

# Production Redis
REDIS_HOST=production-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=production-password

# Production ZaloPay (NOT SANDBOX!)
ZALOPAY_URL_ENDPOINT=https://openapi.zalopay.vn/v2/create  # No 'sb-' prefix!
APP_ID=your_production_app_id
ZALOPAY_KEY1=production_key1
ZALOPAY_KEY2=production_key2

# Production Stripe (LIVE KEY!)
STRIPE_SECRET=sk_live_...  # Must start with sk_live_

# Production JWT (LONGER SECRETS!)
JWT_SECRET=very-long-random-string-for-production
JWT_REFESH_SECREt=another-very-long-random-string

# Production Cloudinary
CLOUDINARY_NAME=production_name
CLOUDINARY_API_KEY=production_key
CLOUDINARY_API_SECRET=production_secret
```

---

### 4. **CORS Configuration**

#### **Kiểm tra CORS settings:**

```bash
grep -r "cors" src/index.ts
```

**Cần có:**
```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',           // Local dev
    'https://yourdomain.com',          // Production frontend
    'https://admin.yourdomain.com'     // Admin panel
  ],
  credentials: true
}));
```

#### ⚠️ **Không dùng `origin: '*'` trên production!**

---

### 5. **Database Migration**

#### **Chạy migration cho Voucher schema:**

```bash
node migrations/update-vouchers-schema.js
```

**Hoặc kết nối MongoDB shell:**
```javascript
use your-database;

// Update existing vouchers
db.vouchers.updateMany(
  { maxUsage: { $exists: false } },
  {
    $set: {
      maxUsage: 9999,
      currentUsage: 0,
      maxDiscountAmount: 0
    }
  }
);

// Verify
db.vouchers.findOne();
```

---

### 6. **Build & Test**

#### **Build TypeScript:**
```bash
npm run build
```

**Kiểm tra:**
- ✅ Không có TypeScript errors
- ✅ Tạo folder `dist/` thành công

#### **Test locally:**
```bash
# Start server
npm run dev

# Test endpoints
curl http://localhost:3000/api/v1/voucher
curl http://localhost:3000/api/v1/order
```

---

### 7. **Dependencies**

#### **Production Dependencies:**
```bash
npm install --production
```

**Kiểm tra package.json:**
- ✅ Tất cả dependencies có đúng version
- ✅ Không có deprecated packages
- ✅ Có script `build`

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts"
  }
}
```

---

### 8. **Logging & Monitoring**

#### **Thêm production logging:**

```typescript
// Add to src/index.ts
if (process.env.NODE_ENV === 'production') {
  // Disable console.log in production
  console.log = () => {};

  // Only keep console.error
} else {
  // Development - log everything
}
```

#### **Recommended: Thêm logging service**
- Winston
- Morgan
- Sentry (error tracking)

---

### 9. **Security Checklist**

#### **Rate Limiting:**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

#### **Helmet (Security Headers):**
```typescript
import helmet from 'helmet';
app.use(helmet());
```

#### **Environment Variables Security:**
- ❌ KHÔNG hardcode secrets trong code
- ✅ Dùng `.env` file
- ✅ Add `.env` vào `.gitignore`
- ✅ Dùng environment variables trên platform deploy

---

### 10. **Platform-Specific Configuration**

#### **A. Deploy lên Vercel:**

**Tạo file `vercel.json`:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Set environment variables trên Vercel Dashboard:**
- Settings → Environment Variables
- Add tất cả variables từ `.env`

**⚠️ QUAN TRỌNG cho Vercel:**
- ✅ Callback URL: `https://your-project.vercel.app/api/v1/order/callback`
- ✅ Free tier có giới hạn: 10s timeout, 4.5GB RAM
- ⚠️ Không tốt cho long-running tasks

---

#### **B. Deploy lên Railway:**

**Tạo file `railway.json`:**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

**Set environment variables:**
- Dashboard → Variables
- Add tất cả từ `.env`

**Domain:**
- Railway tự cấp: `your-app.railway.app`
- Hoặc custom domain

---

#### **C. Deploy lên VPS (Ubuntu):**

**1. Setup Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**2. Clone & Install:**
```bash
git clone your-repo
cd top-gear-be
npm install --production
npm run build
```

**3. Setup PM2:**
```bash
sudo npm install -g pm2
pm2 start dist/index.js --name "top-gear-api"
pm2 save
pm2 startup
```

**4. Setup Nginx reverse proxy:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**5. SSL Certificate:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

---

### 11. **Post-Deployment Testing**

#### **Test các endpoints chính:**

```bash
# Health check
curl https://your-domain.com/

# Voucher
curl https://your-domain.com/api/v1/voucher/customer/available

# Order
curl -X POST https://your-domain.com/api/v1/order \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# ZaloPay callback (test webhook)
curl -X POST https://your-domain.com/api/v1/order/callback \
  -H "Content-Type: application/json" \
  -d '{"data": "test"}'
```

#### **Test voucher system:**
1. Create order với voucher
2. Check `currentUsage` tăng
3. Cancel order
4. Check `currentUsage` giảm (refund)

---

## 📋 FINAL CHECKLIST

### Pre-Deploy:
- [ ] `.env` không bị commit
- [ ] Đã run migration script cho voucher
- [ ] Build thành công (`npm run build`)
- [ ] Test local hoạt động
- [ ] CORS configured đúng
- [ ] Callback URL đúng platform

### Deploy:
- [ ] Set environment variables trên platform
- [ ] Deploy code lên server/platform
- [ ] Verify build thành công
- [ ] Check logs không có errors

### Post-Deploy:
- [ ] Test tất cả endpoints
- [ ] Test create order với voucher
- [ ] Test ZaloPay payment flow
- [ ] Test order cancellation
- [ ] Test voucher refund
- [ ] Monitor logs for errors
- [ ] Setup alerts/monitoring

### Production Settings:
- [ ] **ZaloPay:** Đổi sang production endpoint
- [ ] **ZaloPay:** Đăng ký callback URL với ZaloPay
- [ ] **Stripe:** Đổi sang live key
- [ ] **MongoDB:** Dùng production cluster
- [ ] **Redis:** Dùng production instance
- [ ] **JWT:** Dùng stronger secrets
- [ ] **CORS:** Whitelist specific domains
- [ ] **Rate Limiting:** Enabled
- [ ] **Helmet:** Enabled
- [ ] **Logging:** Production mode

---

## 🔥 CRITICAL ISSUES

### ❗ Callback URL PHẢI đúng!

**Hiện tại trong code:**
```typescript
// Line 48-49 trong payment.service.ts
callback_url: 'https://top-gear-be.vercel.app/api/v1/order/callback'
```

**Nếu deploy lên domain khác → ĐỔI NGAY!**

### ❗ ZaloPay Production

**Sandbox:** `https://sb-openapi.zalopay.vn/v2/create`
**Production:** `https://openapi.zalopay.vn/v2/create` (no 'sb-')

**Cần:**
1. Đăng ký tài khoản production với ZaloPay
2. Lấy production APP_ID, KEY1, KEY2
3. Đổi endpoint
4. Test payment flow

### ❗ Stripe Production

**Test:** `sk_test_...`
**Production:** `sk_live_...`

### ❗ MongoDB Production

- Đừng dùng shared cluster cho production
- Enable authentication
- Whitelist IP addresses
- Regular backups

---

## 📞 Support

**Nếu gặp vấn đề:**
1. Check logs trước
2. Verify environment variables
3. Test endpoints riêng lẻ
4. Check callback URL đã đăng ký với ZaloPay chưa

**Common Issues:**
- ZaloPay không callback → Check URL đã đăng ký
- CORS error → Check origin configuration
- Voucher không refund → Check VoucherUsage collection
- Payment fail → Check ZaloPay keys & endpoint

---

**Version:** 1.0.0
**Last Updated:** 2025-01-13
