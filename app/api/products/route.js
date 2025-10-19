// app/api/products/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { getToken } from "next-auth/jwt";
import { uploadImageBuffer, isCloudinaryConfigured } from "@/lib/cloudinary";
import { Buffer } from "buffer";

const secret = process.env.NEXTAUTH_SECRET;

/* Helpers */
function isValidHttpUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function parsePositiveInt(value, fallback) {
  const n = parseInt(value ?? "", 10);
  return Number.isNaN(n) ? fallback : n;
}

/* GET /api/products?page=1&limit=12&q=shirt&category=Men&gender=Male */
export async function GET(request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parsePositiveInt(searchParams.get("page"), 1));
    let limit = parsePositiveInt(searchParams.get("limit"), 12);
    limit = Math.min(100, Math.max(1, limit)); // clamp 1..100

    const q = (searchParams.get("q") || "").trim();
    const category = (searchParams.get("category") || "").trim();
    const gender = (searchParams.get("gender") || "").trim();
    const season = (searchParams.get("season") || "").trim();

    const filter = {};
    if (q) {
      // search name OR description
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (season) filter.season = season;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
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
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

/* POST /api/products */
export async function POST(request) {
  await dbConnect();
  try {
    // verify token
    const token = await getToken({ req: request, secret });
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const contentType = (request.headers.get("content-type") || "").toLowerCase();
    const isMultipart = contentType.includes("multipart/form-data");

    let payload = {};
    let imageUrl = "";

    if (isMultipart) {
      const formData = await request.formData();
      // extract fields safely
      const getText = (k) => {
        const v = formData.get(k);
        return typeof v === "string" ? v.trim() : "";
      };

      payload.name = getText("name");
      payload.description = getText("description");
      payload.category = getText("category");
      payload.gender = getText("gender");
      payload.season = getText("season");
      const priceRaw = formData.get("price");
      payload.price = Number(priceRaw);

      // image can be provided as URL or File field "image"
      const imageField = formData.get("image");
      const imageUrlField = getText("imageUrl") || getText("image");

      if (imageUrlField) imageUrl = imageUrlField;

      if (imageField && imageField instanceof File) {
        if (!isCloudinaryConfigured()) {
          return NextResponse.json({ success: false, error: "Cloudinary not configured" }, { status: 500 });
        }
        // optional: check file size/type here
        const arrayBuffer = await imageField.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadRes = await uploadImageBuffer(buffer, imageField.name || undefined);
        imageUrl = uploadRes?.secure_url || uploadRes?.url || imageUrl;
      }
    } else {
      // JSON body
      const body = await request.json();
      payload = {
        name: (body.name || "").trim(),
        description: (body.description || "").trim(),
        category: (body.category || "").trim(),
        gender: (body.gender || "").trim(),
        season: (body.season || "").trim(),
        price: typeof body.price === "number" ? body.price : Number(body.price),
      };
      imageUrl = body.image || "";
    }

    // validation
    const name = payload.name || "";
    const description = payload.description || "";
    const price = Number(payload.price);

    if (!name || !description || Number.isNaN(price)) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (name/description/price)" },
        { status: 400 }
      );
    }
    if (price < 0) {
      return NextResponse.json({ success: false, error: "Price must be >= 0" }, { status: 400 });
    }
    if (imageUrl && !isValidHttpUrl(imageUrl)) {
      return NextResponse.json({ success: false, error: "Invalid image URL" }, { status: 400 });
    }

    const doc = await Product.create({
      name,
      description,
      price,
      category: payload.category || undefined,
      gender: payload.gender || undefined,
      season: payload.season || undefined,
      image: imageUrl || undefined,
      createdBy: token.sub,
    });

    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error) {
    console.error("[POST PRODUCT ERROR]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}


// import dbConnect from "@/lib/dbConnect";
// import Product from "@/models/Product";
// import { getToken } from "next-auth/jwt";
// import { uploadImageBuffer, isCloudinaryConfigured } from "@/lib/cloudinary";
// import { Buffer } from "buffer";

// // Secret giống trong NEXTAUTH_SECRET
// const secret = process.env.NEXTAUTH_SECRET;

// /* ----------------------------- UTILS ----------------------------- */
// function isValidHttpUrl(value) {
//   if (!value) return true;
//   try {
//     const url = new URL(value);
//     return url.protocol === "http:" || url.protocol === "https:";
//   } catch {
//     return false;
//   }
// }

// /* ----------------------------- GET ----------------------------- */
// // ✅ GET /api/products?page=1&limit=12&q=shirt&category=Men&gender=Male
// export async function GET(request) {
//   await dbConnect();

//   try {
//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const limit = parseInt(searchParams.get("limit") || "12", 10);
//     const q = searchParams.get("q") || "";
//     const category = searchParams.get("category") || "";
//     const gender = searchParams.get("gender") || "";
//     const season = searchParams.get("season") || "";

//     const filter = {};

//     if (q) filter.name = { $regex: q, $options: "i" };
//     if (category) filter.category = category;
//     if (gender) filter.gender = gender;
//     if (season) filter.season = season;

//     const [items, total] = await Promise.all([
//       Product.find(filter)
//         .sort({ createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(limit),
//       Product.countDocuments(filter),
//     ]);

//     return Response.json({
//       success: true,
//       data: {
//         items,
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("[GET PRODUCTS ERROR]", error);
//     return Response.json({ success: false, error: "Server error" }, { status: 500 });
//   }
// }

// /* ----------------------------- POST ----------------------------- */
// // ✅ POST /api/products (Chỉ cho user đăng nhập)
// export async function POST(request) {
//   await dbConnect();

//   try {
//     // ✅ Kiểm tra token xác thực
//     const token = await getToken({ req: request, secret });
//     if (!token) {
//       return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
//     }

//     const contentType = request.headers.get("content-type") || "";
//     const isMultipart = contentType.includes("multipart/form-data");

//     if (isMultipart) {
//       const formData = await request.formData();
//       const name = formData.get("name");
//       const description = formData.get("description");
//       const price = Number(formData.get("price"));
//       const category = formData.get("category");
//       const gender = formData.get("gender");
//       const season = formData.get("season");
//       const imageFile = formData.get("image");
//       let imageUrl = formData.get("imageUrl") || "";

//       if (!name || !description || Number.isNaN(price)) {
//         return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
//       }

//       if (imageUrl && !isValidHttpUrl(imageUrl)) {
//         return Response.json({ success: false, error: "Invalid image URL" }, { status: 400 });
//       }

//       // ✅ Upload ảnh lên Cloudinary nếu có file
//       if (imageFile && imageFile instanceof File) {
//         if (!isCloudinaryConfigured()) {
//           return Response.json(
//             { success: false, error: "Cloudinary not configured" },
//             { status: 400 }
//           );
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
//         image: imageUrl,
//       });

//       return Response.json({ success: true, data: created }, { status: 201 });
//     }

//     // ✅ Nếu là JSON body
//     const body = await request.json();
//     const { name, description, price, category, gender, season, image } = body;

//     if (!name || !description || typeof price !== "number") {
//       return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
//     }

//     if (image && !isValidHttpUrl(image)) {
//       return Response.json({ success: false, error: "Invalid image URL" }, { status: 400 });
//     }

//     const created = await Product.create({
//       name,
//       description,
//       price,
//       category,
//       gender,
//       season,
//       image,
//     });

//     return Response.json({ success: true, data: created }, { status: 201 });
//   } catch (error) {
//     console.error("[POST PRODUCT ERROR]", error);
//     return Response.json({ success: false, error: "Server error" }, { status: 500 });
//   }
// }


