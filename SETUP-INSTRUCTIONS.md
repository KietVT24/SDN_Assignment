Dựa trên những thay đổi bạn đã thực hiện trong cuộc trao đổi (NextAuth + MongoDB, tách SessionProvider, di chuyển API register, bảo vệ API products, sửa Navbar, gộp ProductCard, UI login/register mới không dùng framer-motion, v.v.), mình đã **cập nhật toàn bộ README** để phản ánh chính xác trạng thái hiện tại của dự án và hướng dẫn dùng/kiểm tra. Dán đè file README (hoặc `README.md`) của bạn bằng nội dung dưới đây.

---

# Modern Clothing Store - Next.js App Router

A modern, scalable e-commerce platform built with Next.js App Router, Tailwind CSS and shadcn/ui components — **(updated)** with authentication (NextAuth + MongoDB), protected product APIs, Cloudinary image upload support, and improved auth UI.

---

## 🎨 Tính năng (cập nhật)

* **Modern UI/UX**: Clean, responsive design with Tailwind CSS
* **Next.js App Router** (app/)
* **Authentication**: NextAuth.js with MongoDB adapter (credentials provider) — register/login/logout
* **Protected API**: POST / PUT / DELETE products được bảo vệ (chỉ user đã đăng nhập), optional ownership (`createdBy`) check
* **CRUD Products**: Create / Read / Update / Delete (support JSON and multipart/form-data for image upload)
* **Image Upload**: Cloudinary integration (upload buffer)
* **Search & Pagination**: Server-side search and pagination for products
* **Toast Notifications**: Global success/error toasts
* **Delete Confirmation**: Modal confirmation for delete
* **Responsive Design**: Mobile-first responsive layout
* **Auth UI**: Login / Register pages redesigned (gradient hero, glassmorphism, animation via Tailwind — no framer-motion required)
* **Navbar**: Search moved to center, Auth (Login/Register or user name + Logout) on right; mobile-friendly

---

## 📁 Cấu trúc dự án (đã cập nhật)

```
clothing-store/
├── app/
│   ├── globals.css
│   ├── layout.js                         # Root layout (Server Component) - uses SessionProviderWrapper
│   ├── page.js
│   └── auth/
│       ├── login/page.js                 # Login UI (client)
│       └── register/page.js              # Register UI (client)
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.js    # NextAuth route
│       │   └── register/route.js         # Register API (POST)
│       └── products/
│           ├── route.js                  # GET (list, pagination, search) + POST (create, protected)
│           └── [id]/route.js             # GET single + PUT (update) + DELETE (delete); protected
├── components/
│   ├── ui/
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Toaster.js
│   ├── layout/
│   │   ├── Navbar.js                     # Updated: search in center, auth on right, mobile adjustments
│   │   ├── Footer.js
│   └── product/
│       ├── ProductCard.js                # Merged & supports image + Edit/Delete shown when logged in
│       ├── ProductForm.js
│       └── DeleteProductModal.js
├── components/providers/
│   └── SessionProviderWrapper.jsx       # Client wrapper for next-auth SessionProvider
├── lib/
│   ├── mongodb.js                        # clientPromise for mongodb (if using mongodb driver)
│   ├── dbConnect.js                      # mongoose connect wrapper (if using mongoose)
│   ├── auth.js                           # next-auth authOptions (CredentialsProvider + MongoDBAdapter)
│   ├── cloudinary.js                     # uploadImageBuffer, isCloudinaryConfigured
│   └── api.js                            # client-side helper wrappers (fetchProducts, createProduct...)
├── models/
│   └── Product.js                        # Mongoose model (if using mongoose)
├── .env.example
├── package.json
└── README.md                             # (this file)
```

> Lưu ý: dự án có thể sử dụng either MongoDB driver (`lib/mongodb.js`) hoặc Mongoose (`lib/dbConnect.js` + `models/Product.js`). Một số file API dùng Mongoose (Product model) để hỗ trợ tính năng nâng cao (filter, pagination, upload).

---

## 🔧 Biến môi trường cần thiết

Thêm (ở `.env.local`) — **bắt buộc** cho Auth + DB + Cloudinary:

```env
# DB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxxx.mongodb.net/myDatabase

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<một-chuỗi-ngẫu-nhiên-dài>

# Cloudinary (nếu dùng upload ảnh)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# (Nếu dùng Prisma/Postgres thay MongoDB, thay đổi tương ứng)
```

---

## 🚀 Cài đặt & chạy (nhanh)

```bash
npm install
# nếu gặp peer dependency conflict khi cài thêm lib animation, dùng --legacy-peer-deps
npm run dev
```

---

## 🛠️ Những thay đổi kỹ thuật chính (chi tiết)

### 1. Authentication (NextAuth + MongoDB)

* `lib/auth.js` chứa `authOptions` dùng `CredentialsProvider` (authorize bằng email/password) và `MongoDBAdapter(clientPromise)` để lưu session nếu cần.
* NextAuth route: `app/api/auth/[...nextauth]/route.js`.
* API đăng ký: `app/api/auth/register/route.js` — **POST** nhận `{ email, password, name }`, hash password (bcrypt), lưu users collection.
* `app/layout.js` được giữ là **Server Component** và **bọc** ứng dụng bằng `SessionProviderWrapper` (client) để `useSession()` hoạt động trong components client (Navbar, ProductCard...).
* `components/providers/SessionProviderWrapper.jsx`:

  ```jsx
  "use client";
  import { SessionProvider } from "next-auth/react";
  export default function SessionProviderWrapper({ children }) {
    return <SessionProvider>{children}</SessionProvider>;
  }
  ```

### 2. Bảo vệ API (POST/PUT/DELETE)

* Sử dụng `getToken({ req, secret })` từ `next-auth/jwt` trong các route server (ví dụ `app/api/products/route.js`, `app/api/products/[id]/route.js`) để kiểm tra session.
* Nếu token không tồn tại → trả `401 Unauthorized`.
* Khi tạo product (POST), lưu `createdBy: token.sub` (user id) để về sau có thể kiểm tra ownership.
* Khi PUT / DELETE, nếu product có `createdBy`, chỉ owner mới được phép (trả `403 Forbidden` khi khác).
* API hỗ trợ JSON body và `multipart/form-data` (treat image file upload via `request.formData()` + Cloudinary buffer upload).

### 3. Cloudinary image upload

* `lib/cloudinary.js` chứa helper `uploadImageBuffer(buffer)` để upload và `isCloudinaryConfigured()` để kiểm tra biến env.
* Trong route POST/PUT, nếu form gửi file, chuyển `File` -> `arrayBuffer()` -> `Buffer` rồi upload.

### 4. UI — Login & Register

* `app/auth/login/page.js` và `app/auth/register/page.js` đã được thiết kế lại theo phong cách **gradient hero + glassmorphism**:

  * Nền: `bg-gradient-to-br from-purple-800 via-indigo-700 to-blue-600`
  * Card: `max-w-md w-full p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg`
  * Inputs: `bg-white/20 rounded-lg focus:ring-2 focus:ring-indigo-400`
  * Button: gradient `from-indigo-500 to-purple-500` với `hover:brightness-110`
* Giao diện **không dùng framer-motion** (đã đổi sang CSS animation `animate-fade-in` trong Tailwind config / globals.css để tránh cài framer-motion).
* Logic submit vẫn như trước: `signIn("credentials")` cho login, `fetch("/api/auth/register")` cho register.

### 5. Navbar (cập nhật)

* Thanh tìm kiếm **được đưa vào giữa** (center) trong desktop.
* Phần Auth (Login/Register) hoặc **tên user + Logout** nằm ở **phía phải** (vị trí cũ của search).
* Mobile: search xuất hiện phía dưới nav, auth hiển thị dưới dạng compact.
* `useSession()` được dùng để hiển thị tên user (tên hoặc email prefix). Đảm bảo `SessionProvider` bọc app.

### 6. ProductCard (gộp)

* `components/product/ProductCard.js` đã gộp 2 phiên bản: hiển thị ảnh (nếu có), tên, description, price, link View.
* Nếu user logged-in (`useSession()`), hiển thị thêm `Edit` + `Delete` (Delete gọi API `DELETE /api/products/:id` và gọi callback `onDelete` để refresh list).

### 7. API products (hợp nhất)

* `app/api/products/route.js`:

  * `GET`: list sản phẩm với `page`, `limit`, `q`, `category`, `gender`, `season`.
  * `POST`: tạo sản phẩm (multipart/json) — **bảo vệ** bằng `getToken`. Lưu `createdBy`.
* `app/api/products/[id]/route.js`:

  * `GET`: trả chi tiết product
  * `PUT`: update product (multipart/json) — bảo vệ & kiểm tra ownership
  * `DELETE`: xóa product — bảo vệ & kiểm tra ownership

---

## ✅ Các file bạn đã thêm/sửa (tóm tắt, để dễ kiểm tra)

* `app/layout.js` — dùng `SessionProviderWrapper`
* `components/providers/SessionProviderWrapper.jsx` — client wrapper
* `app/api/auth/[...nextauth]/route.js` — NextAuth
* `app/api/auth/register/route.js` — API register (moved from app/auth)
* `app/auth/login/page.js`, `app/auth/register/page.js` — UI mới (tailwind, glass)
* `components/layout/Navbar.js` — search center, auth right, mobile search
* `components/product/ProductCard.js` — merged with delete handler
* `app/api/products/route.js` & `app/api/products/[id]/route.js` — merged advanced logic (search, pagination, multipart, Cloudinary, auth)
* `lib/mongodb.js` or `lib/dbConnect.js`, `lib/auth.js`, `lib/cloudinary.js`, `models/Product.js`

---

## 🧪 Cách kiểm tra (quick tests)

1. **Server chạy**:

   ```bash
   npm run dev
   ```

2. **Trang register (GET)**:

   * `GET http://localhost:3000/auth/register` → phải trả page React (200), không 405.
   * Nếu bạn bị `405`, có khả năng có `app/auth/register/route.js` (API) chặn — hãy move file đó sang `app/api/auth/register/route.js`.

3. **Đăng ký**:

   * Điền email + password → submit → gọi `POST /api/auth/register` → trả 201 / 409 / 400 theo tình huống.

4. **Đăng nhập**:

   * Dùng `signIn("credentials")` → khi login thành công, navbar hiển thị tên user + Logout.

5. **Tạo product**:

   * Từ UI (Add Product) hoặc `POST /api/products` (JSON/form-data) — phải trả 401 nếu chưa login.
   * Nếu login, POST thành công → product có `createdBy` = token.sub.

6. **Sửa/Xóa**:

   * `PUT/DELETE /api/products/:id` chỉ hoạt động nếu đã login. Nếu product có `createdBy`, chỉ owner được phép.

7. **Test curl không auth**:

   ```bash
   curl -i -X DELETE http://localhost:3000/api/products/<ID>
   # -> phải trả 401 nếu API đã được bảo vệ
   ```

---

## Mẹo xử lý lỗi phổ biến

* **405 on GET /auth/register** → check `app/auth/register/route.js` tồn tại (nếu có, move sang `app/api/auth/register/route.js`).
* **useSession must be wrapped in SessionProvider** → ensure `SessionProviderWrapper` được import ở `app/layout.js`.
* **Module framer-motion missing** → UI hiện đã chuyển sang không dùng framer-motion; nếu bạn vẫn muốn dùng, cài `npm install framer-motion --legacy-peer-deps`.
* **MongoDB adapter peer deps** → `@next-auth/mongodb-adapter` có peer dep mongodb `^4 || ^5`. Nếu dùng mongodb driver v6, cân nhắc dùng `--legacy-peer-deps` hoặc hạ version mongodb driver hoặc dùng mongoose.

---

## Kế hoạch đề xuất (nếu bạn muốn hoàn thiện hơn)

* Thêm email verification (sau register).
* Thêm role/permissions (admin vs user) để phân quyền chỉnh/xóa sản phẩm.
* Thêm shopping cart + checkout (Stripe).
* Thêm tests tự động cho endpoints auth + products.
* Thêm CI (GitHub Actions) và deploy script cho Vercel.

---
