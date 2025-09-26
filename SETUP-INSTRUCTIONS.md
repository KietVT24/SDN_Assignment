# Hướng dẫn Setup Clothing Store

## 1. Cài đặt Dependencies
```bash
npm install
```

## 2. Cấu hình Environment Variables
Tạo file `.env.local` trong thư mục gốc với nội dung:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/clothing-store

# Cloudinary (optional - for image uploads)
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
# CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Next.js
NEXT_PUBLIC_API_URL=
```

## 3. Cài đặt MongoDB
- Cài đặt MongoDB Community Server
- Khởi động MongoDB service
- Hoặc sử dụng MongoDB Atlas (cloud)

## 4. Seed Database (Tùy chọn)
```bash
npm run seed
```

## 5. Chạy Development Server
```bash
npm run dev
```

## 6. Kiểm tra Console Logs
Mở Developer Tools (F12) và kiểm tra Console để xem:
- Kết nối MongoDB
- API calls
- Dữ liệu products được fetch

## 7. Truy cập ứng dụng
- Homepage: http://localhost:3000
- Products: http://localhost:3000/products
- API: http://localhost:3000/api/products

## Lưu ý
- Đảm bảo MongoDB đang chạy trước khi start ứng dụng
- Kiểm tra console logs để debug các vấn đề
- Nếu không có dữ liệu, chạy `npm run seed` để tạo sample data
