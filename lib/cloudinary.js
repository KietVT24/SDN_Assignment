// lib/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_UPLOAD_PRESET,
} = process.env;

/**
 * Kiểm tra env để biết Cloudinary đã được cấu hình đầy đủ chưa
 * @returns {boolean}
 */
export function isCloudinaryConfigured() {
  return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);
}

/**
 * Cấu hình cloudinary client (idempotent)
 */
export function configureCloudinary() {
  if (!isCloudinaryConfigured()) return;
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Upload buffer lên Cloudinary bằng upload_stream.
 *
 * Signature:
 *   uploadImageBuffer(buffer) // dùng folder mặc định 'clothing-store'
 *   uploadImageBuffer(buffer, filename) // filename dùng để tạo public_id
 *   uploadImageBuffer(buffer, filename, folder) // truyền folder tùy chọn
 *
 * Trả về promise resolve với result object của Cloudinary.
 *
 * @param {Buffer|Uint8Array} buffer
 * @param {string} [filename] - tuỳ chọn, sẽ được kết hợp với timestamp để tạo public_id
 * @param {string} [folder='clothing-store']
 * @returns {Promise<Object>}
 */
export function uploadImageBuffer(buffer, filename = undefined, folder = "clothing-store") {
  if (!isCloudinaryConfigured()) {
    // Ném lỗi rõ ràng để caller có thể xử lý (hoặc fallback về URL)
    throw new Error("Cloudinary is not configured. Provide image as URL or set Cloudinary env vars.");
  }

  configureCloudinary();

  return new Promise((resolve, reject) => {
    const publicId = filename ? `${Date.now()}-${String(filename).replace(/\s+/g, "-")}` : undefined;

    const uploadOptions = {
      folder,
    };

    if (publicId) uploadOptions.public_id = publicId;
    if (CLOUDINARY_UPLOAD_PRESET) uploadOptions.upload_preset = CLOUDINARY_UPLOAD_PRESET;

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    stream.end(buffer);
  });
}

export default cloudinary;


// import { v2 as cloudinary } from 'cloudinary';

// const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_UPLOAD_PRESET } =
//   process.env;

// export function isCloudinaryConfigured() {
//   return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);
// }

// export function configureCloudinary() {
//   if (!isCloudinaryConfigured()) return;
//   cloudinary.config({
//     cloud_name: CLOUDINARY_CLOUD_NAME,
//     api_key: CLOUDINARY_API_KEY,
//     api_secret: CLOUDINARY_API_SECRET,
//     secure: true,
//   });
// }

// export async function uploadImageBuffer(buffer, folder = 'clothing-store') {
//   if (!isCloudinaryConfigured()) {
//     throw new Error(
//       'Cloudinary is not configured. Provide image as URL or set Cloudinary env vars.'
//     );
//   }

//   configureCloudinary();

//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder,
//         upload_preset: CLOUDINARY_UPLOAD_PRESET || undefined,
//       },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       }
//     );
//     stream.end(buffer);
//   });
// }

// export default cloudinary;
