import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

// GET: Lấy chi tiết đơn hàng
export async function GET(request, { params }) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const { id } = params;

    await dbConnect();

    const order = await Order.findById(id).populate('items.product');
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Kiểm tra quyền truy cập (chỉ user sở hữu mới xem được)
    if (order.user.toString() !== token.sub) {
      return NextResponse.json(
        { error: 'Forbidden - You cannot access this order' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order detail error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order', details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Cập nhật trạng thái đơn hàng (dành cho admin hoặc payment callback)
export async function PUT(request, { params }) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { status, paymentStatus } = await request.json();

    await dbConnect();

    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Kiểm tra quyền (user chỉ có thể cancel order của mình)
    if (order.user.toString() !== token.sub) {
      return NextResponse.json(
        { error: 'Forbidden - You cannot modify this order' },
        { status: 403 }
      );
    }

    // User chỉ có thể cancel order nếu status là pending
    if (status === 'cancelled' && order.status === 'pending') {
      order.status = 'cancelled';
    }

    // Cập nhật payment status nếu được cung cấp
    if (paymentStatus && ['unpaid', 'paid', 'refunded'].includes(paymentStatus)) {
      order.paymentStatus = paymentStatus;
      if (paymentStatus === 'paid') {
        order.paidAt = new Date();
      }
    }

    await order.save();
    await order.populate('items.product');

    return NextResponse.json({
      success: true,
      message: 'Order updated',
      data: order
    });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Failed to update order', details: error.message },
      { status: 500 }
    );
  }
}