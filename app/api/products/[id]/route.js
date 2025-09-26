import dbConnect from '../../../../lib/dbConnect.js';
import Product from '../../../../models/Product.js';
import formidable from 'formidable';
import { uploadImageBuffer, isCloudinaryConfigured } from '../../../../lib/cloudinary.js';
import { promises as fs } from 'fs';

// export const config đã deprecated trong App Router
// Sử dụng request.formData() để xử lý multipart form data

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const product = await Product.findById(params.id);
    
    if (!product) {
      return Response.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
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

      const updated = await Product.findByIdAndUpdate(
        params.id,
        { name, description, price, category, gender, season, image: imageUrl },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return Response.json({ success: false, error: 'Product not found' }, { status: 404 });
      }

      return Response.json({ success: true, data: updated });
    }

    // JSON body
    const body = await request.json();
    const { name, description, price, category, gender, season, image } = body;
    
    if (!name || !description || typeof price !== 'number' || !category || !gender || !season) {
      return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    const updated = await Product.findByIdAndUpdate(
      params.id,
      { name, description, price, category, gender, season, image },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return Response.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();

  try {
    const deleted = await Product.findByIdAndDelete(params.id);
    
    if (!deleted) {
      return Response.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: deleted });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
