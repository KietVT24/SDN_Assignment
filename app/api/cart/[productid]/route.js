import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/dbConnect';
import Cart from '@/models/Cart';
import mongoose from 'mongoose';

// DELETE: Xóa một sản phẩm khỏi giỏ hàng
export async function DELETE(request, { params }) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    // Await params in Next.js 15+ or if using dynamic routes
    const resolvedParams = await Promise.resolve(params);
    const { productid: productId } = params;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    await dbConnect();

    const cart = await Cart.findOne({ user: token.sub });
    
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    // Check if item exists in cart
    const itemExists = cart.items.some(
      item => item.product.toString() === productId
    );

    if (!itemExists) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    // Xóa item
    cart.removeItem(productId);
    await cart.save();
    
    // Populate after save
    await cart.populate('items.product');

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    console.error('Remove item error:', error);
    return NextResponse.json(
      { error: 'Failed to remove item', details: error.message },
      { status: 500 }
    );
  }
}