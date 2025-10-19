import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/dbConnect';
import Cart from '@/models/Cart';
import Product from '@/models/Product';

// GET: Lấy giỏ hàng của user
export async function GET(request) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    await dbConnect();

    let cart = await Cart.findOne({ user: token.sub }).populate('items.product');
    
    // Nếu chưa có cart, tạo mới
    if (!cart) {
      cart = await Cart.create({ user: token.sub, items: [] });
    }

    return NextResponse.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Thêm sản phẩm vào giỏ hàng
export async function POST(request) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Kiểm tra sản phẩm có tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Tìm hoặc tạo cart
    let cart = await Cart.findOne({ user: token.sub });
    
    if (!cart) {
      cart = new Cart({ user: token.sub, items: [] });
    }

    // Thêm item vào cart
    cart.addItem(productId, product.price, quantity);
    await cart.save();

    // Populate để trả về đầy đủ thông tin
    await cart.populate('items.product');

    return NextResponse.json({
      success: true,
      message: 'Product added to cart',
      data: cart
    }, { status: 201 });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Failed to add product to cart', details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Cập nhật số lượng sản phẩm trong giỏ
export async function PUT(request) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const { productId, quantity } = await request.json();

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
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

    // Cập nhật quantity (nếu quantity = 0 thì sẽ remove)
    cart.updateItemQuantity(productId, quantity);
    await cart.save();
    await cart.populate('items.product');

    return NextResponse.json({
      success: true,
      message: 'Cart updated',
      data: cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { error: 'Failed to update cart', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Xóa toàn bộ giỏ hàng
export async function DELETE(request) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
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

    cart.clearCart();
    await cart.save();

    return NextResponse.json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart', details: error.message },
      { status: 500 }
    );
  }
}