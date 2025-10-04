// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

/**
 * Simple email regex for basic validation.
 * (Not perfect but good enough for most use-cases)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  try {
    // Parse JSON body
    const body = await req.json();
    const { email, password, name } = body || {};

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email và password bắt buộc" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const trimmedPassword = String(password).trim();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Email không hợp lệ" },
        { status: 400 }
      );
    }

    if (trimmedPassword.length < 6) {
      return NextResponse.json(
        { error: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    // Check if email already exists
    const existing = await users.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: "Email đã được đăng ký" },
        { status: 409 } // 409 Conflict
      );
    }

    // Hash password
    const hashed = await bcrypt.hash(trimmedPassword, 10);

    const newUser = {
      email: normalizedEmail,
      password: hashed,
      name: name ? String(name).trim() : null,
      createdAt: new Date(),
    };

    const result = await users.insertOne(newUser);

    // Return inserted id as string
    return NextResponse.json(
      { ok: true, id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (err) {
    console.error("[REGISTER API ERROR]", err);

    // Handle duplicate key error just in case (race condition)
    if (err && err.code === 11000) {
      return NextResponse.json(
        { error: "Email đã được đăng ký" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Lỗi server, vui lòng thử lại sau" },
      { status: 500 }
    );
  }
}


// import clientPromise from "@/lib/mongodb";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { email, password, name } = body;

//     if (!email || !password) {
//       return new Response(JSON.stringify({ error: "Email và password bắt buộc" }), { status: 400 });
//     }

//     const client = await clientPromise;
//     const db = client.db();
//     const users = db.collection("users");

//     const existing = await users.findOne({ email });
//     if (existing) {
//       return new Response(JSON.stringify({ error: "Email đã được đăng ký" }), { status: 400 });
//     }

//     const hashed = await bcrypt.hash(password, 10);

//     const newUser = {
//       email,
//       password: hashed,
//       name: name || null,
//       createdAt: new Date(),
//     };

//     const result = await users.insertOne(newUser);

//     return new Response(JSON.stringify({ ok: true, id: result.insertedId }), { status: 201 });
//   } catch (err) {
//     console.error(err);
//     return new Response(JSON.stringify({ error: "Lỗi server" }), { status: 500 });
//   }
// }
