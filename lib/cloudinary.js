import { v2 as cloudinary } from 'cloudinary';

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_UPLOAD_PRESET } =
  process.env;

export function isCloudinaryConfigured() {
  return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);
}

export function configureCloudinary() {
  if (!isCloudinaryConfigured()) return;
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function uploadImageBuffer(buffer, folder = 'clothing-store') {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary is not configured. Provide image as URL or set Cloudinary env vars.'
    );
  }

  configureCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        upload_preset: CLOUDINARY_UPLOAD_PRESET || undefined,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export default cloudinary;
