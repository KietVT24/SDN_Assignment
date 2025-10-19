import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Cart from '@/models/Cart';

// GET: Lấy danh sách đơn hàng của user
export async function GET(request) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    await dbConnect();

    // Build query
    const query = { user: token.sub };
    if (status) {
      query.status = status;
    }

    // Pagination
    const skip = (page - 1) * limit;
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('items.product')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Tạo đơn hàng mới từ giỏ hàng
export async function POST(request) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { shippingAddress, notes, paymentMethod = 'cash' } = body;

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address) {
      return NextResponse.json(
        { error: 'Shipping address is required (fullName, phone, address)' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Lấy giỏ hàng
    const cart = await Cart.findOne({ user: token.sub }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Tạo order items từ cart
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      image: item.product.image
    }));

    // Tạo order
    const order = await Order.create({
      user: token.sub,
      items: orderItems,
      totalAmount: cart.totalAmount,
      shippingAddress,
      notes,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'unpaid'
    });

    // Xóa giỏ hàng sau khi tạo order
    cart.clearCart();
    await cart.save();

    // Populate để trả về đầy đủ thông tin
    await order.populate('items.product');

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: order
    }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}