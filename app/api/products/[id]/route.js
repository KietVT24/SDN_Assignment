// app/api/products/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect.js";
import Product from "../../../../models/Product.js";
import { uploadImageBuffer, isCloudinaryConfigured } from "../../../../lib/cloudinary.js";
import { getToken } from "next-auth/jwt";

function isValidHttpUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// NEXTAUTH_SECRET (phải có trong .env)
const secret = process.env.NEXTAUTH_SECRET;

/**
 * GET: public - lấy chi tiết product
 */
export async function GET(request, { params }) {
  await dbConnect();

  try {
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("[GET PRODUCT ERROR]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

/**
 * PUT: chỉ cho user đã đăng nhập.
 * Nếu product.createdBy tồn tại -> chỉ owner được phép.
 * Hỗ trợ multipart/form-data (file upload) và JSON body.
 */
export async function PUT(request, { params }) {
  await dbConnect();

  try {
    // check session/token
    const token = await getToken({ req: request, secret });
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // load product to check ownership (if any)
    const existingProduct = await Product.findById(params.id);
    if (!existingProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // If product has createdBy field, enforce owner-only update
    if (existingProduct.createdBy && existingProduct.createdBy.toString() !== token.sub) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const contentType = request.headers.get("content-type") || "";
    const isMultipart = contentType.includes("multipart/form-data");

    if (isMultipart) {
      const formData = await request.formData();
      const name = formData.get("name");
      const description = formData.get("description");
      const price = Number(formData.get("price"));
      const category = formData.get("category");
      const gender = formData.get("gender");
      const season = formData.get("season");
      const imageFile = formData.get("image");

      if (!name || !description || Number.isNaN(price) || !category || !gender || !season) {
        return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
      }

      let imageUrl = formData.get("imageUrl") || "";

      if (imageUrl && !isValidHttpUrl(imageUrl)) {
        return NextResponse.json({ success: false, error: "Image URL must be a valid http/https link" }, { status: 400 });
      }

      if (imageFile && imageFile instanceof File) {
        if (!isCloudinaryConfigured()) {
          return NextResponse.json({
            success: false,
            error: "Cloudinary not configured. Provide image URL in body or set Cloudinary env vars.",
          }, { status: 400 });
        }

        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadRes = await uploadImageBuffer(buffer);
        imageUrl = uploadRes.secure_url;
      }

      const updated = await Product.findByIdAndUpdate(
        params.id,
        { name, description, price, category, gender, season, image: imageUrl },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: updated });
    }

    // JSON body handling
    const body = await request.json();
    const { name, description, price, category, gender, season, image } = body;

    if (!name || !description || typeof price !== "number" || !category || !gender || !season) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }
    if (image && !isValidHttpUrl(image)) {
      return NextResponse.json({ success: false, error: "Image URL must be a valid http/https link" }, { status: 400 });
    }

    const updated = await Product.findByIdAndUpdate(
      params.id,
      { name, description, price, category, gender, season, image },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[PUT PRODUCT ERROR]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

/**
 * DELETE: chỉ cho user đã đăng nhập.
 * Nếu product.createdBy tồn tại -> chỉ owner được phép.
 */
export async function DELETE(request, { params }) {
  await dbConnect();

  try {
    const token = await getToken({ req: request, secret });
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    if (product.createdBy && product.createdBy.toString() !== token.sub) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const deleted = await Product.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("[DELETE PRODUCT ERROR]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}



// import dbConnect from '../../../../lib/dbConnect.js';
// import Product from '../../../../models/Product.js';
// import formidable from 'formidable';
// import { uploadImageBuffer, isCloudinaryConfigured } from '../../../../lib/cloudinary.js';
// import { promises as fs } from 'fs';

// // export const config đã deprecated trong App Router
// // Sử dụng request.formData() để xử lý multipart form data

// function isValidHttpUrl(value) {
//   if (!value) return true;
//   try {
//     const url = new URL(value);
//     return url.protocol === 'http:' || url.protocol === 'https:';
//   } catch {
//     return false;
//   }
// }

// export async function GET(request, { params }) {
//   await dbConnect();

//   try {
//     const product = await Product.findById(params.id);
    
//     if (!product) {
//       return Response.json({ success: false, error: 'Product not found' }, { status: 404 });
//     }

//     return Response.json({ success: true, data: product });
//   } catch (error) {
//     console.error(error);
//     return Response.json({ success: false, error: 'Server error' }, { status: 500 });
//   }
// }

// export async function PUT(request, { params }) {
//   await dbConnect();

//   try {
//     const contentType = request.headers.get('content-type') || '';
//     const isMultipart = contentType.includes('multipart/form-data');

//     if (isMultipart) {
//       const formData = await request.formData();
//       const name = formData.get('name');
//       const description = formData.get('description');
//       const price = Number(formData.get('price'));
//       const category = formData.get('category');
//       const gender = formData.get('gender');
//       const season = formData.get('season');
//       const imageFile = formData.get('image');

//       if (!name || !description || Number.isNaN(price) || !category || !gender || !season) {
//         return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
//       }

//       let imageUrl = formData.get('imageUrl') || '';

//       if (imageUrl && !isValidHttpUrl(imageUrl)) {
//         return Response.json({ success: false, error: 'Image URL must be a valid http/https link' }, { status: 400 });
//       }

//       if (imageFile && imageFile instanceof File) {
//         if (!isCloudinaryConfigured()) {
//           return Response.json({
//             success: false,
//             error: 'Cloudinary not configured. Provide image URL in body or set Cloudinary env vars.',
//           }, { status: 400 });
//         }
        
//         const arrayBuffer = await imageFile.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);
//         const uploadRes = await uploadImageBuffer(buffer);
//         imageUrl = uploadRes.secure_url;
//       }

//       const updated = await Product.findByIdAndUpdate(
//         params.id,
//         { name, description, price, category, gender, season, image: imageUrl },
//         { new: true, runValidators: true }
//       );

//       if (!updated) {
//         return Response.json({ success: false, error: 'Product not found' }, { status: 404 });
//       }

//       return Response.json({ success: true, data: updated });
//     }

//     // JSON body
//     const body = await request.json();
//     const { name, description, price, category, gender, season, image } = body;
    
//     if (!name || !description || typeof price !== 'number' || !category || !gender || !season) {
//       return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
//     }
//   if (image && !isValidHttpUrl(image)) {
//     return Response.json({ success: false, error: 'Image URL must be a valid http/https link' }, { status: 400 });
//   }
    
//     const updated = await Product.findByIdAndUpdate(
//       params.id,
//       { name, description, price, category, gender, season, image },
//       { new: true, runValidators: true }
//     );

//     if (!updated) {
//       return Response.json({ success: false, error: 'Product not found' }, { status: 404 });
//     }

//     return Response.json({ success: true, data: updated });
//   } catch (error) {
//     console.error(error);
//     return Response.json({ success: false, error: 'Server error' }, { status: 500 });
//   }
// }

// export async function DELETE(request, { params }) {
//   await dbConnect();

//   try {
//     const deleted = await Product.findByIdAndDelete(params.id);
    
//     if (!deleted) {
//       return Response.json({ success: false, error: 'Product not found' }, { status: 404 });
//     }

//     return Response.json({ success: true, data: deleted });
//   } catch (error) {
//     console.error(error);
//     return Response.json({ success: false, error: 'Server error' }, { status: 500 });
//   }
// }
