import dbConnect from '../../../lib/dbConnect.js';
import Product from '../../../models/Product.js';
import formidable from 'formidable';
import { uploadImageBuffer, isCloudinaryConfigured } from '../../../lib/cloudinary.js';
import { promises as fs } from 'fs';

// export const config đã deprecated trong App Router
// Sử dụng request.formData() để xử lý multipart form data

function toBoolean(value) {
  return value === 'true' || value === true;
}

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12';
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const gender = searchParams.get('gender') || '';
    const season = searchParams.get('season') || '';
    
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    
    const filter = {};
    
    // Search by name
    if (q) {
      filter.name = { $regex: q, $options: 'i' };
    }
    
    // Filter by category
    if (category) {
      filter.category = category;
    }
    
    // Filter by gender
    if (gender) {
      filter.gender = gender;
    }
    
    // Filter by season
    if (season) {
      filter.season = season;
    }

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    const responseData = {
      success: true,
      data: {
        items,
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };

    console.log('API Response:', responseData);
    return Response.json(responseData);
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const contentType = request.headers.get('content-type') || '';
    const isMultipart = contentType.includes('multipart/form-data');

    if (isMultipart) {
      const formData = await request.formData();
      const name = formData.get('name');
      const description = formData.get('description');
      const price = Number(formData.get('price'));
      const category = formData.get('category');
      const gender = formData.get('gender');
      const season = formData.get('season');
      const imageFile = formData.get('image');

      if (!name || !description || Number.isNaN(price) || !category || !gender || !season) {
        return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
      }

      let imageUrl = formData.get('imageUrl') || '';

      if (imageFile && imageFile instanceof File) {
        if (!isCloudinaryConfigured()) {
          return Response.json({
            success: false,
            error: 'Cloudinary not configured. Provide image URL in body or set Cloudinary env vars.',
          }, { status: 400 });
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
        image: imageUrl 
      });
      
      return Response.json({ success: true, data: created }, { status: 201 });
    }

    // JSON body
    const body = await request.json();
    const { name, description, price, category, gender, season, image } = body;
    
    if (!name || !description || typeof price !== 'number' || !category || !gender || !season) {
      return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    const created = await Product.create({ name, description, price, category, gender, season, image });
    return Response.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
