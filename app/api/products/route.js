//  app/api/products/route.js
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { getToken } from "next-auth/jwt";
import { uploadImageBuffer, isCloudinaryConfigured } from "@/lib/cloudinary";
import { Buffer } from "buffer";

// Secret giống trong NEXTAUTH_SECRET
const secret = process.env.NEXTAUTH_SECRET;

/* ----------------------------- UTILS ----------------------------- */
function isValidHttpUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/* ----------------------------- GET ----------------------------- */
// ✅ GET /api/products?page=1&limit=12&q=shirt&category=Men&gender=Male
export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const gender = searchParams.get("gender") || "";
    const season = searchParams.get("season") || "";

    const filter = {};

    if (q) filter.name = { $regex: q, $options: "i" };
    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (season) filter.season = season;

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    return Response.json({
      success: true,
      data: {
        items,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET PRODUCTS ERROR]", error);
    return Response.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

/* ----------------------------- POST ----------------------------- */
// ✅ POST /api/products (Chỉ cho user đăng nhập)
export async function POST(request) {
  await dbConnect();

  try {
    // ✅ Kiểm tra token xác thực
    const token = await getToken({ req: request, secret });
    if (!token) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
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
      let imageUrl = formData.get("imageUrl") || "";

      if (!name || !description || Number.isNaN(price)) {
        return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
      }

      if (imageUrl && !isValidHttpUrl(imageUrl)) {
        return Response.json({ success: false, error: "Invalid image URL" }, { status: 400 });
      }

      // ✅ Upload ảnh lên Cloudinary nếu có file
      if (imageFile && imageFile instanceof File) {
        if (!isCloudinaryConfigured()) {
          return Response.json(
            { success: false, error: "Cloudinary not configured" },
            { status: 400 }
          );
        }

        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadRes = await uploadImageBuffer(buffer);
        imageUrl = uploadRes.secure_url;
      }

      const created = await Product.create({
        name,
        description,
        price,
        category,
        gender,
        season,
        image: imageUrl,
      });

      return Response.json({ success: true, data: created }, { status: 201 });
    }

    // ✅ Nếu là JSON body
    const body = await request.json();
    const { name, description, price, category, gender, season, image } = body;

    if (!name || !description || typeof price !== "number") {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if (image && !isValidHttpUrl(image)) {
      return Response.json({ success: false, error: "Invalid image URL" }, { status: 400 });
    }

    const created = await Product.create({
      name,
      description,
      price,
      category,
      gender,
      season,
      image,
    });

    return Response.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("[POST PRODUCT ERROR]", error);
    return Response.json({ success: false, error: "Server error" }, { status: 500 });
  }
}









// import clientPromise from "@/lib/mongodb";
// import { getToken } from "next-auth/jwt";
// import authOptions from "@/lib/auth";

// // Lấy secret giống NEXTAUTH_SECRET
// const secret = process.env.NEXTAUTH_SECRET;

// export async function GET(req) {
//   const client = await clientPromise;
//   const db = client.db();
//   const products = await db.collection("products").find({}).toArray();
//   return new Response(JSON.stringify(products), { status: 200 });
// }

// export async function POST(req) {
//   // kiểm tra token/session
//   const token = await getToken({ req, secret });
//   if (!token) {
//     return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
//   }

//   const body = await req.json();
//   const { name, description, price, image } = body;

//   if (!name || !description || !price) {
//     return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
//   }

//   const client = await clientPromise;
//   const db = client.db();
//   const result = await db.collection("products").insertOne({
//     name, description, price, image: image || null, createdAt: new Date()
//   });

//   return new Response(JSON.stringify({ ok: true, id: result.insertedId }), { status: 201 });
// }

// // (Bạn có thể viết PUT, DELETE tương tự, đều kiểm tra getToken trước)




// import dbConnect from '../../../lib/dbConnect.js';
// import Product from '../../../models/Product.js';
// import formidable from 'formidable';
// import { uploadImageBuffer, isCloudinaryConfigured } from '../../../lib/cloudinary.js';
// import { promises as fs } from 'fs';

// // export const config đã deprecated trong App Router
// // Sử dụng request.formData() để xử lý multipart form data

// function toBoolean(value) {
//   return value === 'true' || value === true;
// }

// function isValidHttpUrl(value) {
//   if (!value) return true;
//   try {
//     const url = new URL(value);
//     return url.protocol === 'http:' || url.protocol === 'https:';
//   } catch {
//     return false;
//   }
// }

// export async function GET(request) {
//   await dbConnect();

//   try {
//     const { searchParams } = new URL(request.url);
//     const page = searchParams.get('page') || '1';
//     const limit = searchParams.get('limit') || '12';
//     const q = searchParams.get('q') || '';
//     const category = searchParams.get('category') || '';
//     const gender = searchParams.get('gender') || '';
//     const season = searchParams.get('season') || '';
    
//     const pageNum = parseInt(page, 10) || 1;
//     const limitNum = parseInt(limit, 10) || 12;
    
//     const filter = {};
    
//     // Search by name
//     if (q) {
//       filter.name = { $regex: q, $options: 'i' };
//     }
    
//     // Filter by category
//     if (category) {
//       filter.category = category;
//     }
    
//     // Filter by gender
//     if (gender) {
//       filter.gender = gender;
//     }
    
//     // Filter by season
//     if (season) {
//       filter.season = season;
//     }

//     const [items, total] = await Promise.all([
//       Product.find(filter)
//         .sort({ createdAt: -1 })
//         .skip((pageNum - 1) * limitNum)
//         .limit(limitNum),
//       Product.countDocuments(filter),
//     ]);

//     const responseData = {
//       success: true,
//       data: {
//         items,
//         page: pageNum,
//         limit: limitNum,
//         total,
//         totalPages: Math.ceil(total / limitNum),
//       },
//     };

//     console.log('API Response:', responseData);
//     return Response.json(responseData);
//   } catch (error) {
//     console.error(error);
//     return Response.json({ success: false, error: 'Server error' }, { status: 500 });
//   }
// }

// export async function POST(request) {
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

//       const created = await Product.create({ 
//         name, 
//         description, 
//         price, 
//         category, 
//         gender, 
//         season, 
//         image: imageUrl 
//       });
      
//       return Response.json({ success: true, data: created }, { status: 201 });
//     }

//     // JSON body
//     const body = await request.json();
//     const { name, description, price, category, gender, season, image } = body;
    
//     if (!name || !description || typeof price !== 'number' || !category || !gender || !season) {
//       return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
//     }
//     if (image && !isValidHttpUrl(image)) {
//       return Response.json({ success: false, error: 'Image URL must be a valid http/https link' }, { status: 400 });
//     }
    
//     const created = await Product.create({ name, description, price, category, gender, season, image });
//     return Response.json({ success: true, data: created }, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return Response.json({ success: false, error: 'Server error' }, { status: 500 });
//   }
// }
